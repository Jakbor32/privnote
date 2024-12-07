import { useEffect } from "react";
import supabase from "../../utils/supabaseConfig";

interface Note {
  note_uid: string;
  created_at: string;
  note_time: string;
}

interface CheckNoteExpirationProps {
  setIsExpired: (isExpired: boolean) => void; 
  noteId: string;
}

function CheckNoteExpiration({ setIsExpired, noteId }: CheckNoteExpirationProps) {
  useEffect(() => {
    async function fetchNotes() {
      try {
        const { data: notes, error } = await supabase
          .from("privnote")
          .select("note_uid, created_at, note_time")
          .eq("note_uid", noteId);

        if (error) {
          console.error("Error:", error.message);
          return;
        }

        if (notes && notes.length > 0) {
          checkExpirationNotes(notes);
        } else {
          setIsExpired(true); 
        }
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
      }
    }

    async function checkExpirationNotes(notes: Note[]) {
      const now = new Date();
      const note = notes[0]; 

      const noteTime = note.note_time;
      const noteLifeTime = convertToMilliseconds(noteTime);
      const createdAt = new Date(note.created_at);
      const difference = now.getTime() - createdAt.getTime();

      if (difference > noteLifeTime) {
        setIsExpired(true); 
      } else {
        setIsExpired(false);
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
  }, [noteId, setIsExpired]);

  return null;
}

export default CheckNoteExpiration;
