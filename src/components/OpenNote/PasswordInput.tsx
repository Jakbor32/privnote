import React from "react";

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
  revealNote: () => void;
  darkMode: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ password, setPassword, revealNote, darkMode }) => (
  <div className="flex flex-col items-center w-full">
    <button
      onClick={revealNote}
      className="relative flex items-center justify-center w-full h-full p-4 py-10 mb-5 overflow-hidden text-white transition-opacity bg-black bg-opacity-50 hover:bg-opacity-70"
    >
      <div className="absolute p-32 rounded-full hover:border-2 animate-ping "></div>
      <span className="text-xl font-semibold">Reveal Note</span>
    </button>

    <p>Enter password to unlock note</p>
    <input
      type="password"
      placeholder="type here..."
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className={`w-40 px-3 py-2 my-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        darkMode ? "text-white bg-stone-800 border-gray-700" : "text-gray-700 bg-white border-gray-300"
      }`}
    />
  </div>
);

export default PasswordInput;
