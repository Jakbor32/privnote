import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Header from "./../common/Header";
import Footer from "./../common/Footer";
import NoteLinkBox from "./NoteLinkBox";
import CopyButton from "./../common/CopyButton";
import DestroyNoteButton from "./DestroyNoteButton";
import Container from "../common/Container";
import { useDarkMode } from "..//DarkMode";

interface LinkToNoteProps {
  noteId: string;
}

function LinkToNote({ noteId }: LinkToNoteProps): JSX.Element {
  const { darkMode } = useDarkMode();
  const [link, setLink] = useState<string>("");

  useEffect(() => {
    setLink(`${noteId}`);
  }, [noteId]);

  return (
    <Container>
      <Header darkMode={darkMode} />
      <NoteLinkBox link={link} darkMode={darkMode} />
      <div className="flex justify-center gap-6 mb-4">
        <CopyButton copy={link} darkMode={darkMode} />
        <DestroyNoteButton noteId={noteId} darkMode={darkMode} />
      </div>
      <Footer darkMode={darkMode} />
      <Toaster position="top-left" reverseOrder={true} />
    </Container>
  );
}

export default LinkToNote;
