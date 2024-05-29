import { useEffect } from "react";
import supabase from "../../utils/supabaseConfig";

interface CheckNoteExpirationProps {
  noteId: string;
  setExpired: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckNoteExpiration: React.FC<CheckNoteExpirationProps> = ({ noteId, setExpired }) => {
  useEffect(() => {
    const checkExpiration = async () => {
      try {
        const { data, error } = await supabase
          .from("privnote")
          .select("created_at")
          .eq("note_uid", noteId)
          .single();
        if (error) {
          console.error(error.message);
          return;
        }

        const createdAt = new Date(data.created_at);
        const currentTime = new Date();
        const diffInMinutes = (currentTime.getTime() - createdAt.getTime()) / (1000 * 60);
        if (diffInMinutes > 600) {
          setExpired(true); 
          await supabase.from("privnote").delete().eq("note_uid", noteId);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    checkExpiration();
  }, [setExpired, noteId]);

  return null;
};

export default CheckNoteExpiration;
