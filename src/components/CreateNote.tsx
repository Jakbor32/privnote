import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import supabase from "../../utils/supabaseConfig";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import LinkToNote from "./LinkToNote";
import { useDarkMode } from "./DarkMode";

interface NoteData {
  note_uid: string;
  value: string;
}

function CreateNote(): JSX.Element {
  const { darkMode } = useDarkMode();
  const [note, setNote] = useState<string>("");
  const [noteId, setNoteId] = useState<string>("");
  const [isNoteCreated, setIsNoteCreated] = useState<boolean>(false);

  const notify = (): void => {
    toast.error("Note cannot be empty");
  };

  const handleCreateNote = async (): Promise<void> => {
    if (note.trim()) {
      const { data, error } = await supabase
        .from("privnote")
        .insert([{ value: note }])
        .select("note_uid")
        .single();

      if (error) {
        console.error(error);
      } else {
        setNoteId((data as NoteData).note_uid);
        setIsNoteCreated(true);
        setNote("");
      }
    } else {
      notify();
    }
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

  return (
    <div>
      {isNoteCreated ? (
        <LinkToNote noteId={noteId} />
      ) : (
        <div
          className={`h-screen flex flex-col items-center w-full gap-4 p-4 ${
            darkMode ? "bg-[#15202B]" : "bg-[#7899A6]"
          }`}
        >
          <h1
            className={`mb-4 text-2xl font-bold text-center ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Privnote
          </h1>
          <textarea
            className={`w-full sm:w-4/5 md:w-3/5 xl:w-2/5 p-4 h-1/4 ${
              darkMode
                ? "bg-[#465555] border-[#465555] text-gray-200"
                : "bg-[#e7ed67] border-[#e7ed67]"
            } resize focus:outline-none border-4 border-double`}
            placeholder="Write your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
          <div className="flex justify-center gap-6 mb-4">
            <button
              className={`px-6 py-2 font-semibold rounded shadow ${
                darkMode
                  ? "text-white bg-stone-800 border border-gray-800 hover:bg-stone-900"
                  : "text-black bg-white hover:bg-stone-200"
              }`}
              onClick={handleCreateNote}
            >
              Create
            </button>
            <button
              className={`px-6 py-2 font-semibold rounded shadow ${
                darkMode
                  ? "text-white bg-stone-800 border border-gray-800 hover:bg-stone-900"
                  : "text-black bg-white hover:bg-stone-200"
              }`}
              onClick={() => setNote("")}
            >
              Clear
            </button>
          </div>
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
      )}
    </div>
  );
}

export default CreateNote;
