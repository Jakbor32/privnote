import { useState, ChangeEvent } from "react";
import { useDarkMode } from "../../components/DarkMode";
import AdvancedModal from "./AdvancedModal";
import toast from "react-hot-toast";
import Textarea from "./TextArea.tsx";
import Buttons from "./Buttons";
import Container from "../common/Container";

interface CreateNoteAreaProps {
  note: string;
  setNote: (note: string) => void;
  handleCreateNote: () => void;
  setPassword: (password: string) => void;
  setEmail: (email: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedViews: string;
  setSelectedViews: (views: string) => void;
}

function CreateNoteArea({
  note,
  setNote,
  handleCreateNote,
  setPassword,
  setEmail,
  selectedTime,
  setSelectedTime,
  selectedViews,
  setSelectedViews,
}: CreateNoteAreaProps): JSX.Element {
  const { darkMode } = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleChangeTime = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedTime(event.target.value);
    toast.success("Time Changed");
  };

  const handleChangeViews = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedViews(event.target.value);
    toast.success("Views Changed");
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

  return (
    <Container>
      <Textarea note={note} onChange={setNote} darkMode={darkMode} />
      <Buttons
        darkMode={darkMode}
        onCreateNote={handleCreateNote}
        onClearNote={() => setNote("")}
        onOpenAdvanced={() => setIsModalOpen(true)}
      />
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
    </Container>
  );
}

export default CreateNoteArea;
