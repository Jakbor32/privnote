import { useState, useEffect, ChangeEvent } from "react";
import { FaGithub } from "react-icons/fa";
import supabase from "../../utils/supabaseConfig";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import LinkToNote from "./LinkToNote";
import { useDarkMode } from "./DarkMode";
import CheckNoteExpiration from "./CheckNoteExpiration";
import AdvancedModal from "./AdvancedModal";

interface NoteData {
  note_uid: string;
  value: string;
}

function CreateNote(): JSX.Element {
  const { darkMode } = useDarkMode();
  const [note, setNote] = useState<string>("");
  const [noteId, setNoteId] = useState<string>("");
  const [isNoteCreated, setIsNoteCreated] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>("10h");
  const [selectedViews, setSelectedViews] = useState<string>("1");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const notify = (): void => {
    toast.error("Note cannot be empty");
  };
  
  const handleChangeTime = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedTime(event.target.value);
    toast.success("Time Changed")
  };
  const handleChangeViews = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedViews(event.target.value);
    toast.success("Views Changed")
  };
  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const handleSavePassword = (password: string): void => {
    setPassword(password);
    toast.success("Password Set");
    setIsModalOpen(false);
  };

  const handleSaveEmail = (email: string): void => {
    setEmail(email);
    toast.success("Email Set");
    setIsModalOpen(false);
  };
  const handleCreateNote = async (): Promise<void> => {
    if (note.trim()) {
      const { data, error } = await supabase
        .from("privnote")
        .insert([{ value: note, note_time: `${selectedTime}`, note_password: password, note_views: `${selectedViews}`, note_email: email }])
        .select("note_uid")
        .single();

      if (error) {
        console.error(error);
      } else {
        setNoteId((data as NoteData).note_uid);
        setIsNoteCreated(true);
        setNote("");
        setPassword("");
        setEmail("");
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
      <CheckNoteExpiration />
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
            } resize focus:outline-none border-4`}
            placeholder="Write your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
          <div className="flex flex-wrap justify-center gap-6 mb-4">
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
            <button
              className={`px-6 py-2 font-semibold rounded shadow ${
                darkMode
                  ? "text-white bg-stone-800 border border-gray-800 hover:bg-stone-900"
                  : "text-black bg-white hover:bg-stone-200"
              }`}
              onClick={() => setIsModalOpen(true)}
            >
              Advanced
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
          <AdvancedModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            selectedTime={selectedTime}
            selectedViews={selectedViews}
            handleChangeTime={handleChangeTime}
            handleChangeViews={handleChangeViews}
            handleSavePassword={handleSavePassword}
            handleSaveEmail={handleSaveEmail}
          />
          <Toaster position="top-left" reverseOrder={true} />
        </div>
      )}
    </div>
  );
}

export default CreateNote;
