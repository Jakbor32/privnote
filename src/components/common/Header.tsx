import React from "react";
import { GoShieldCheck } from "react-icons/go";

interface NoteHeaderProps {
  darkMode: boolean;
}

const Header: React.FC<NoteHeaderProps> = ({ darkMode }) => (
  <div className="flex items-center justify-center mb-4">
    <GoShieldCheck
      className={`mr-2 ${darkMode ? "text-white" : "text-gray-800"}`}
      size={24} 
    />
    <h1
      className={`text-center text-2xl font-bold ${
        darkMode ? "text-white" : "text-gray-800"
      }`}
    >
      Privnote
    </h1>
  </div>
);

export default Header;
