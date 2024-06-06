import React, { useState } from "react";
import { useDarkMode } from "./DarkMode";
import { toast } from 'react-hot-toast';

interface NotePasswordProps {
  password: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
}

const NotePassword: React.FC<NotePasswordProps> = ({ password, onChange, onSave, onClose }) => {
  const { darkMode } = useDarkMode();
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleConfirmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleSave = () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      onSave();
    }
  };

  return (
    <div>
      <h2 className="mt-8 mb-4 text-lg font-bold">Select note password</h2>
      <div className="relative w-full mb-2">
        <input
          type="password"
          value={password}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'text-white bg-stone-800 border-gray-700' : 'text-gray-700 bg-white border-gray-300'}`}
        />
      </div>
      <h3 className="my-2 font-bold text-md">Confirm password</h3>
      <div className="relative w-full mb-4">
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'text-white bg-stone-800 border-gray-700' : 'text-gray-700 bg-white border-gray-300'}`}
        />
      </div>
      <button
        className={`px-3 py-2 mr-2 cursor-pointer rounded-md hover:opacity-90 ${darkMode ? 'text-white bg-stone-900' : 'text-black bg-gray-300'}`}
        onClick={handleSave}
      >
        Save
      </button>
      <button
        className={`px-3 py-2 cursor-pointer rounded-md hover:opacity-90 ${darkMode ? 'text-white bg-stone-900' : 'text-black bg-gray-300'}`}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default NotePassword;
