import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import supabase from "../../utils/supabaseConfig";
import { useDarkMode } from "./../DarkMode";
import sendEmail from "../../utils/EmailSender";
import Header from "./../common/Header";
import OpenNoteContent from "./OpenNoteContent";
import Footer from "./../common/Footer";
import PasswordInput from "./PasswordInput";
import RevealButton from "./RevealButton";
import Container from "../common/Container";
import { useRedirectHandlers } from "../../utils/useRedirectHandlers";

const OpenNote: React.FC = () => {
  const { noteId } = useParams<Record<string, string | undefined>>();
  const { darkMode } = useDarkMode();
  const [noteContent, setNoteContent] = useState<string>("");
  const [revealed, setRevealed] = useState<boolean>(false);
  const [noteNotFound, setNoteNotFound] = useState<boolean>(false);
  const [invalidKey, setInvalidKey] = useState<boolean>(false);
  const [missingKey, setMissingKey] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [noteViews, setNoteViews] = useState<string>("");
  const [requiresPassword, setRequiresPassword] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);
  const [encryptionKey, setEncryptionKey] = useState<string>("");

  useRedirectHandlers({ revealed, noteContent, noteNotFound });

  useEffect(() => {
    if (noteId) {
      loadNoteMeta(noteId);
    }
  }, [noteId]);

  useEffect(() => {
    if (hasLoadedOnce || noteNotFound) {
      window.history.pushState({}, "", "/hidden");
    }
  }, [hasLoadedOnce, noteNotFound, invalidKey]);

  const decryptNote = (
    encryptedNote: string,
    encryptionKey: string
  ): string => {
    try {
      // ******Decrypt the note using AES decryption******
      const bytes = CryptoJS.AES.decrypt(encryptedNote, encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption failed:", error);
      return "Decryption failed. Invalid key or data.";
    }
  };

  // Only fetches metadata needed to render the page before any password is
  // entered or a view is consumed (never note_password/note_email/value --
  // see supabase/migrations/0001_privnote_rls_and_rpc.sql).
  const loadNoteMeta = async (id: string): Promise<void> => {
    try {
      const { data, error } = await supabase.rpc("get_note_meta", {
        p_note_uid: id,
      });
      const meta = data?.[0];

      if (error || !meta || !meta.found) {
        setNoteNotFound(true);
        setHasLoadedOnce(true);
        return;
      }

      if (meta.is_expired) {
        setIsExpired(true);
        setHasLoadedOnce(true);
        return;
      }

      const keyFromHash = window.location.hash.substring(1);
      if (!keyFromHash) {
        setNoteNotFound(true);
        setMissingKey(true);
        setHasLoadedOnce(true);
        return;
      }
      setEncryptionKey(keyFromHash);

      setRequiresPassword(meta.requires_password);
      setNoteViews(meta.note_views ?? "");
      setHasLoadedOnce(true);
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Error:", error);
    }
  };

  const revealNote = async (): Promise<void> => {
    try {
      if (!noteId) return;

      const { data, error } = await supabase.rpc("reveal_note", {
        p_note_uid: noteId,
        p_password: password,
      });
      const result = data?.[0];

      if (error || !result) {
        toast.error("Failed to reveal note!");
        return;
      }

      if (result.status === "invalid_password") {
        toast.error("Incorrect password!");
        return;
      }

      if (result.status === "not_found") {
        setNoteNotFound(true);
        setRevealed(true);
        return;
      }

      if (result.status === "expired") {
        setIsExpired(true);
        setRevealed(true);
        return;
      }

      const decryptedContent = decryptNote(result.value ?? "", encryptionKey);

      if (!decryptedContent) {
        setInvalidKey(true);
        setRevealed(true);
        return;
      }

      setNoteContent(decryptedContent);
      setRevealed(true);
      sendEmail(result.note_email ?? "");
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      toast.error("Failed to reveal note!");
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
      {missingKey ? (
        <div className="flex flex-col items-center w-full p-4 sm:w-4/5 md:w-3/5 xl:w-2/5 h-1/4">
          <p
            className={`mt-4 text-center ${
              darkMode ? "text-yellow-500" : "text-yellow-400"
            }`}
          >
            This is your link, but it's missing the decryption key:
          </p>
          <p
            className={`mt-2 text-center ${
              darkMode ? "text-gray-200" : "text-gray-300"
            }`}
          >
            <span>{`${window.location.origin}${window.location.pathname}`}</span>
            <span className="text-yellow-400 animate-pulse">
              #Your_decryption_key_here
            </span>
          </p>
          <br />
          <a
            href="https://privnote-app.vercel.app"
            className={`text-gray-300 underline ${
              darkMode ? "text-gray-200" : "text-gray-500"
            }`}
          >
            Create a new note.
          </a>
        </div>
      ) : !revealed ? (
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
            {isExpired
              ? "You can no longer see this note"
              : noteViews
              ? `You can only view this note ${noteViews} ${
                  noteViews === "1" ? "time" : "times"
                }`
              : "You can no longer see this note"}
          </p>
        </div>
      ) : noteNotFound ? (
        <div className="text-center">
          <p className="pb-4 text-gray-300">
            Note not found. <br />
            Use the link below or refresh the page by clicking F5 to create a
            new note.
          </p>
          <a
            href="https://privnote-app.vercel.app"
            className="text-gray-300 underline"
          >
            Create new note.
          </a>
        </div>
      ) : isExpired ? (
        <div className="text-center">
          <p className="pb-4 text-gray-300">
            This note has expired. <br />
            Use the link below to create a new note.
          </p>
          <a
            href="https://privnote-app.vercel.app"
            className="text-gray-300 underline"
          >
            Create new note.
          </a>
        </div>
      ) : invalidKey ? (
        <div className="flex flex-col items-center w-full p-4 sm:w-4/5 md:w-3/5 xl:w-2/5 h-1/4">
          <p
            className={`text-xl mt-4 text-center ${
              darkMode ? "text-red-400" : "text-red-800"
            }`}
          >
            Decryption key is incorrect
          </p>
          <br />
          <a
            href="https://privnote-app.vercel.app"
            className={`text-gray-300 underline ${
              darkMode ? "text-gray-200" : "text-gray-500"
            }`}
          >
            Create a new note.
          </a>
        </div>
      ) : (
        <OpenNoteContent
          darkMode={darkMode}
          noteContent={noteContent}
          noteViews={noteViews}
        />
      )}
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
  );
};

export default OpenNote;
