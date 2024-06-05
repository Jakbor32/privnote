import { useEffect } from "react";
import supabase from "../../utils/supabaseConfig";

interface Note {
  note_uid: string;
  created_at: string;
}

function CheckNoteExpiration() {
  useEffect(() => {
    async function fetchNotes() {
      try {
        const { data: notes, error } = await supabase
          .from("privnote")
          .select("note_uid, created_at");

        if (error) {
          console.error("Error:", error.message);
          return;
        }

        if (notes && notes.length > 0) {
          checkExpirationNotes(notes);
        }
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
      }
    }

    async function checkExpirationNotes(notes: Note[]) {
      const now = new Date();
      const expiredNotes: Note[] = [];
    
      for (const note of notes) {
        try {
          const { data, error } = await supabase
            .from("privnote")
            .select("note_time")
            .eq("note_uid", note.note_uid)
            .single();
    
          if (error) {
            console.error("Error:", error.message);
            continue;
          }
    
          const noteTime = data?.note_time; 
          const noteLifeTime = convertToMilliseconds(noteTime); 
          const createdAt = new Date(note.created_at);
          const difference = now.getTime() - createdAt.getTime();
    
          if (difference > noteLifeTime) {
            expiredNotes.push(note);
          }
        } catch (error) {
          console.error("Error:", error instanceof Error ? error.message : error);
        }
      }
    
      if (expiredNotes.length > 0) {
        deleteExpiredNotes(expiredNotes);
      }
    }

    async function deleteExpiredNotes(expiredNotes: Note[]) {
      try {
        const noteIds = expiredNotes.map(note => note.note_uid);
        const { error } = await supabase
          .from("privnote")
          .delete()
          .in("note_uid", noteIds);

        if (error) {
          console.error("Error:", error.message);
        } 
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
      }
    }

    function convertToMilliseconds(noteTime: string): number {
      const timeUnit = noteTime.slice(-1);
      const timeValue = parseInt(noteTime.slice(0, -1));
      let milliseconds = 0;

      switch (timeUnit) {
        case "h":
          milliseconds = timeValue * 60 * 60 * 1000;
          break;
        case "m":
          milliseconds = timeValue * 60 * 1000;
          break;
        default:
          milliseconds = 0;
      }

      return milliseconds;
    }

    fetchNotes();
  }, []);

  return null; 
}

export default CheckNoteExpiration;
