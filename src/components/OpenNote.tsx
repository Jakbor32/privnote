import React, { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { useParams } from "react-router-dom";
import toast, { Toaster, useToasterStore  } from "react-hot-toast";
import supabase from "../../utils/supabaseConfig";
import { useDarkMode } from "./DarkMode";

const OpenNote: React.FC = () => {
  const { noteId } = useParams<Record<string, string | undefined>>();
  const { darkMode } = useDarkMode();
  const [noteContent, setNoteContent] = useState<string>("");
  const [revealed, setRevealed] = useState<boolean>(false);
  const [noteNotFound, setNoteNotFound] = useState<boolean>(false);
 
  useEffect(() => {
    if (noteId) {
      loadNoteContent(noteId);
    } else {
      setNoteNotFound(true);
    }
  }, [noteId]);
  
  const loadNoteContent = async (noteId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("privnote")
        .select("value")
        .eq("note_uid", noteId)
        .single();

      if (error) {
        setNoteNotFound(true);
      } else {
        setNoteContent(data?.value ?? "");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Error:", error);
      }
    }
  };

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(noteContent);
    toast.success("Note content copied to clipboard!", {
      style: {
        borderRadius: "10px",
        background: darkMode ? "#333" : "#ABA",
        color: "#fff",
      },
    });
  };

  // Toast Limiter
  
  const TOAST_LIMIT = 1;
  const { toasts } = useToasterStore();
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

    

  const revealNote = async (): Promise<void> => {
    try {
      setRevealed(true);
      if (noteId) {
        await supabase.from("privnote").delete().eq("note_uid", noteId);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Error:", error);
      }
      toast.error("Failed to reveal note!");
    }
  };

  const revealButton = (
    <button
      onClick={revealNote}
      className="absolute inset-0 flex items-center justify-center w-full h-full text-white transition-opacity bg-black bg-opacity-50 hover:bg-opacity-70"
    >
      <span className="text-xl font-semibold">Reveal Note</span>
    </button>
  );

  const textArea = (
    <textarea
      readOnly
      className={`w-full sm:w-4/5 md:w-3/5 xl:w-2/5 p-4 h-1/4 ${
        darkMode
          ? "bg-[#465555] border-[#465555] text-gray-200"
          : "bg-[#e7ed67] border-[#e7ed67]"
      }`}
      value={noteContent}
    />
  );

  return (
    <div
      className={`h-screen flex flex-col items-center w-full gap-4 p-4 ${
        darkMode ? "bg-[#15202B] text-white" : "bg-[#7899A6] text-black"
      }`}
    >
      <h1 className="mb-4 text-2xl font-bold text-center">Privnote</h1>
      {revealed ? (
        noteNotFound ? (
          <div className="text-center">
            <p className="pb-4 text-gray-300 ">
              Note not found or has expired.
            </p>
            <a
              href="https://privnote-app.vercel.app"
              className="text-gray-300 underline "
            >
              Create new note.
            </a>
          </div>
        ) : (
          <>
            {textArea}
            <div className="flex justify-center gap-6 mb-4">
              <button
                className={`px-6 py-2 font-semibold rounded shadow ${
                  darkMode
                    ? "text-white bg-stone-800 border border-gray-800 hover:bg-stone-900"
                    : "text-black bg-white hover:bg-stone-200"
                }`}
                onClick={copyToClipboard}
              >
                Copy
              </button>
            </div>
          </>
        )
      ) : (
        <>
          <div className="relative w-full p-4 sm:w-4/5 md:w-3/5 xl:w-2/5 h-1/4">
            <div className="absolute inset-0 bg-blur" />
            {revealButton}
            <p className="text-center text-gray-300 bottom-2 left-2 animate-pulse">
              You can only view this note once.
            </p>
          </div>
        </>
      )}
      <footer
        className={`fixed text-center bottom-1 flex items-center gap-2 ${
          darkMode ? "text-gray-500" : "text-gray-300"
        }`}
      >
        <a
          className="hover:text-white hover:animate-pulse"
          href="https://github.com/Jakbor32"
        >
          <FaGithub size="20" />
        </a>
        <p>© 2024 Jakub Borowy</p>
      </footer>
      <Toaster position="top-left" reverseOrder={true} />
    </div>
  );
};

export default OpenNote;
