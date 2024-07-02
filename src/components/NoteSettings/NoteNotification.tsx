import React from "react";
import { useDarkMode } from "../DarkMode";
import { toast } from "react-hot-toast";

interface NoteNotificationProps {
  email: string;
  onEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (email: string) => void;
  onClose: () => void;
}

const NoteNotification: React.FC<NoteNotificationProps> = ({
  email,
  onEmailChange,
  onSave,
  onClose,
}) => {
  const { darkMode } = useDarkMode();
  const isEmailValid = (email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleEmailSave = () => {
    if (email.trim() === '') {
      toast.error('Email cannot be empty.');
      return;
    }
  
    if (!isEmailValid(email)) {
      toast.error('Invalid email format.');
      return;
    }
  
    onSave(email);
  };
  return (
    <div className="flex flex-col space-y-4">
        <h2 className="mt-4 text-xs font-bold">Notify me if someone reads the note</h2>
      <input
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="your e-mail here"
        className="w-full p-2 text-black border rounded"
      />
      <div>

     <button
        className={`px-3 py-2 mr-2 cursor-pointer rounded-md hover:opacity-90 ${
            darkMode ? "text-white bg-stone-900" : "text-black bg-gray-300"
            }`}
            onClick={handleEmailSave}
            >
        Save
      </button>
      <button
        className={`px-3 py-2 cursor-pointer rounded-md hover:opacity-90 ${
            darkMode ? "text-white bg-stone-900" : "text-black bg-gray-300"
            }`}
            onClick={onClose}
            >
        Close
      </button>
          </div>
    </div>
  );
};

export default NoteNotification;
