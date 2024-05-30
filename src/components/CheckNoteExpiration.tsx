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
      const noteLifeTime = 36000000;
      const expiredNotes: Note[] = [];

      notes.forEach(note => {
        const createdAt = new Date(note.created_at);
        const difference = now.getTime() - createdAt.getTime();

        if (difference > noteLifeTime) {
          expiredNotes.push(note);
        }
      });

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

    fetchNotes();
  }, []);

  return null;
}

export default CheckNoteExpiration;
