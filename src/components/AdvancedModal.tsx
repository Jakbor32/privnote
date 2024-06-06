import React, { ChangeEvent, useState } from "react";
import { IoMdTime, IoMdNotifications } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { useDarkMode } from "./DarkMode";
import NoteTime from "./NoteTime";
import NotePassword from "./NotePassword";

interface AdvancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTime: string;
  handleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const AdvancedModal: React.FC<AdvancedModalProps> = ({
  isOpen,
  onClose,
  selectedTime,
  handleChange,
}) => {
  const { darkMode } = useDarkMode();
  const [activeComponent, setActiveComponent] = useState<'time' | 'password'>('time');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleNoteTimeChange = (value: string) => {
    handleChange({
      target: { value }
    } as ChangeEvent<HTMLSelectElement>);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50" onClick={onClose}></div>
      <div className={`relative z-10 p-6 rounded shadow-lg w-80 ${darkMode ? 'bg-stone-800 text-white' : 'bg-white text-black'}`}>
        <div className={`top-0 left-0 flex justify-between p-3 rounded-lg cursor-pointer  ${darkMode ? 'bg-stone-900 text-white' : 'bg-gray-300 text-black'}`}>
          <IoMdTime
            size={20}
            className={`cursor-pointer ${activeComponent === 'time' ? (darkMode ? 'shadow-stone-100 scale-125' : 'shadow-gray-100 scale-125') : 'opacity-25'}`}
            onClick={() => setActiveComponent('time')}
          />
          <RiLockPasswordLine
            size={20}
            className={`cursor-pointer ${activeComponent === 'password' ? (darkMode ? 'shadow-stone-100 scale-125' : 'shadow-gray-100 scale-125') : 'opacity-25'}`}
            onClick={() => setActiveComponent('password')}
          />
          <FaEye size={20} className="opacity-25" />
          <IoMdNotifications size={20} className="opacity-25" />
        </div>
        {activeComponent === 'time' ? (
          <NoteTime
            selectedTime={selectedTime}
            onSelect={handleNoteTimeChange}
            onClose={onClose}
          />
        ) : (
          <NotePassword
            password={password}
            onChange={handlePasswordChange}
            onSave={onClose}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AdvancedModal;
