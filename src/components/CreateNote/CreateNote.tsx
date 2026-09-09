import { useState, useEffect } from "react";
import supabase from "../../utils/supabaseConfig";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import LinkToNote from "../LinkToNote/LinkToNote";
import CreateNoteArea from "./CreateNoteArea";
import { useDarkMode } from "./../DarkMode";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Container from "../common/Container";
import CryptoJS from "crypto-js";

function CreateNote(): JSX.Element {
  const { darkMode } = useDarkMode();
  const [note, setNote] = useState<string>("");
  const [noteId, setNoteId] = useState<string>("");
  const [isNoteCreated, setIsNoteCreated] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>("24h");
  const [selectedViews, setSelectedViews] = useState<string>("1");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const notify = (): void => {
    toast.error("Note cannot be empty");
  };

  const handleCreateNote = async (): Promise<void> => {
    if (note.trim()) {
      // ******Generate a random encryption key and encrpy note******
      const encryptionKey = CryptoJS.lib.WordArray.random(16).toString();
      const encryptedNote = CryptoJS.AES.encrypt(
        note,
        encryptionKey
      ).toString();

      const { data: newNoteUid, error } = await supabase.rpc("create_note", {
        p_value: encryptedNote,
        p_note_time: selectedTime,
        p_note_password: password,
        p_note_views: selectedViews,
        p_note_email: email,
      });

      if (error || !newNoteUid) {
        console.error(error);
        toast.error("Failed to create note!");
      } else {
        //******Link with the encryption key in the URL hash******
        const noteLink = `${window.location.origin}/${newNoteUid}#${encryptionKey}`;
        setNoteId(noteLink);
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
          <Toaster
            position="top-left"
            reverseOrder={true}
            toastOptions={{
              style: {
                borderRadius: "10px",
                background: darkMode ? "#333" : "#ABA",
                color: "#fff",
              },
            }}
          />
        </Container>
      )}
    </div>
  );
}

export default CreateNote;
