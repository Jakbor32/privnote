import { useState, useEffect } from "react";
import supabase from "../../utils/supabaseConfig";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import LinkToNote from "../LinkToNote/LinkToNote";
import CheckNoteExpiration from "./CheckNoteExpiration";
import CreateNoteArea from "./CreateNoteArea";
import { useDarkMode } from "./../DarkMode";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Container from "../common/Container";

interface NoteData {
  note_uid: string;
  value: string;
}

function CreateNote(): JSX.Element {
  const { darkMode } = useDarkMode();
  const [note, setNote] = useState<string>("");
  const [noteId, setNoteId] = useState<string>("");
  const [isNoteCreated, setIsNoteCreated] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>("10h");
  const [selectedViews, setSelectedViews] = useState<string>("1");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const notify = (): void => {
    toast.error("Note cannot be empty");
  };

  const handleCreateNote = async (): Promise<void> => {
    if (note.trim()) {
      const { data, error } = await supabase
        .from("privnote")
        .insert([
          {
            value: note,
            note_time: `${selectedTime}`,
            note_password: password,
            note_views: `${selectedViews}`,
            note_email: email,
          },
        ])
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
        <Container>
          <Header darkMode={darkMode} />
          <CreateNoteArea
            note={note}
            setNote={setNote}
            handleCreateNote={handleCreateNote}
            setPassword={setPassword}
            setEmail={setEmail}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedViews={selectedViews}
            setSelectedViews={setSelectedViews}
          />
          <Footer darkMode={darkMode} />
          <Toaster position="top-left" reverseOrder={true} />
        </Container>
      )}
    </div>
  );
}

export default CreateNote;
