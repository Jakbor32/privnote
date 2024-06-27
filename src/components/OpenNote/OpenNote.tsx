import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import supabase from "../../../utils/supabaseConfig";
import { useDarkMode } from "./../DarkMode";
import sendEmail from "./../EmailSender";
import Header from "./../common/Header";
import OpenNoteContent from "./OpenNoteContent";
import Footer from "./../common/Footer";
import PasswordInput from "./PasswordInput";
import RevealButton from "./RevealButton";
import Container from "../common/Container";

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
  const [noteEmail, setNoteEmail] = useState<string>("");

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
        .select("value, note_password, note_views, note_email")
        .eq("note_uid", noteId)
        .single();

      if (error) {
        setNoteNotFound(true);
      } else {
        setNoteContent(data?.value ?? "");
        setStoredPassword(data?.note_password ?? "");
        setRequiresPassword(data?.note_password !== "");
        setNoteViews(data?.note_views ?? "");
        setNoteEmail(data?.note_email ?? "");
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Error:", error);
    }
  };

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
              .update({
                note_views: (noteViewsInt - 1).toString(),
                note_email: "",
              })
              .eq("note_uid", noteId);
            setNoteViews((noteViewsInt - 1).toString());
          }
        }
        sendEmail(noteEmail);
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
    <Container>
      <Header darkMode={darkMode} />
      {revealed ? (
        noteNotFound ? (
          <div className="text-center">
            <p className="pb-4 text-gray-300 ">
              Note not found or has expired.
            </p>
            <a
              href="https://privnote-app.vercel.app"
              className="text-gray-300 underline"
            >
              Create new note.
            </a>
          </div>
        ) : (
          <OpenNoteContent
            darkMode={darkMode}
            noteContent={noteContent}
            noteViews={noteViews}
          />
        )
      ) : (
        <div className="flex flex-col items-center w-full p-4 sm:w-4/5 md:w-3/5 xl:w-2/5 h-1/4">
          {requiresPassword ? (
            <PasswordInput
              password={password}
              setPassword={setPassword}
              revealNote={revealNote}
              darkMode={darkMode}
            />
          ) : (
            <RevealButton revealNote={revealNote} />
          )}
          <p className="mt-4 text-center text-gray-300 animate-pulse">
            {noteViews
              ? `You can only view this note ${noteViews} ${
                  noteViews === "1" ? "time" : "times"
                }`
              : "You can no longer see this note"}
          </p>
        </div>
      )}
      <Footer darkMode={darkMode} />
      <Toaster position="top-left" reverseOrder={true} />
      </Container>
  );
};

export default OpenNote;
