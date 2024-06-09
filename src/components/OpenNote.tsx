import React, { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { useParams } from "react-router-dom";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import supabase from "../../utils/supabaseConfig";
import { useDarkMode } from "./DarkMode";

const OpenNote: React.FC = () => {
  const { noteId } = useParams<Record<string, string | undefined>>();
  const { darkMode } = useDarkMode();
  const [noteContent, setNoteContent] = useState<string>("");
  const [revealed, setRevealed] = useState<boolean>(false);
  const [noteNotFound, setNoteNotFound] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [storedPassword, setStoredPassword] = useState<string>("");
  const [noteViews, setNoteViews] = useState<string>("");
  const [requiresPassword, setRequiresPassword] = useState<boolean>(false);

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
        .select("value, note_password, note_views")
        .eq("note_uid", noteId)
        .single();

      if (error) {
        setNoteNotFound(true);
      } else {
        setNoteContent(data?.value ?? "");
        setStoredPassword(data?.note_password ?? "");
        setRequiresPassword(data?.note_password !== "");
        setNoteViews(data?.note_views ?? "");
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
    if (!requiresPassword || password === storedPassword) {
      try {
        setRevealed(true);
        if (noteId) {
          const noteViewsInt = parseInt(noteViews);
          if (noteViewsInt <= 1) {
            await supabase.from("privnote").delete().eq("note_uid", noteId);
          } else {
            await supabase
              .from("privnote")
              .update({ note_views: (noteViewsInt - 1).toString() })
              .eq("note_uid", noteId);
            setNoteViews((noteViewsInt - 1).toString());
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("Error:", error);
        }
        toast.error("Failed to reveal note!");
      }
    } else {
      toast.error("Incorrect password!");
    }
  };

  const revealButton = (
    <button
      onClick={revealNote}
      className="relative flex items-center justify-center w-full h-full p-4 overflow-hidden text-white transition-opacity bg-black bg-opacity-50 hover:bg-opacity-70"
    >
      <div className="absolute p-32 rounded-full hover:border-2 animate-ping "></div>
      <span className="text-xl font-semibold">Reveal Note</span>
    </button>
  );

  const passwordInput = (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={revealNote}
        className="relative flex items-center justify-center w-full h-full p-4 py-10 mb-5 overflow-hidden text-white transition-opacity bg-black bg-opacity-50 hover:bg-opacity-70"
      >
        <div className="absolute p-32 rounded-full hover:border-2 animate-ping "></div>
        <span className="text-xl font-semibold">Reveal Note</span>
      </button>

      <p>Enter password to unlock note</p>
      <input
        type="password"
        placeholder="type here..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`w-40 px-3 py-2 my-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          darkMode
            ? "text-white bg-stone-800 border-gray-700"
            : "text-gray-700 bg-white border-gray-300"
        }`}
      />
    </div>
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
          <div className="flex flex-col items-center w-full p-4 sm:w-4/5 md:w-3/5 xl:w-2/5 h-1/4">
            {requiresPassword ? passwordInput : revealButton}
            <p className="mt-4 text-center text-gray-300 animate-pulse">
              {noteViews
                ? `You can only view this note ${noteViews} ${
                    noteViews === "1" ? "time" : "times"
                  }`
                : "You can no longer see this note"}
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
