import React from "react";
import toast from "react-hot-toast";
import supabase from "../../utils/supabaseConfig";

interface DestroyNoteButtonProps {
  grabLink: string;
  darkMode: boolean;
}

const DestroyNoteButton: React.FC<DestroyNoteButtonProps> = ({
  grabLink,
  darkMode,
}) => {
  const handleDestroyNote = async (): Promise<void> => {
    try {
      const extractedNoteId = grabLink.split("/").pop()?.split("#")[0];
      const { error } = await supabase
        .from("privnote")
        .delete()
        .eq("note_uid", extractedNoteId);
      if (error) {
        throw new Error(error.message);
      }
      toast.success("Note destroyed successfully!", {
        style: {
          borderRadius: "10px",
          background: darkMode ? "#333" : "#ABA",
          color: "#fff",
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        toast.error("Failed to destroy note!");
      } else {
        console.error("Error:", err);
        toast.error("Error occurred!");
      }
    }
  };

  return (
    <button
      className={`px-6 py-2 font-semibold rounded shadow ${
        darkMode
          ? "text-white bg-red-950 hover:opacity-85"
          : "text-white bg-red-900 hover:opacity-85"
      }`}
      onClick={handleDestroyNote}
    >
      Destroy Note
    </button>
  );
};

export default DestroyNoteButton;
