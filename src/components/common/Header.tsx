import React from "react";

interface NoteHeaderProps {
  darkMode: boolean;
}

const Header: React.FC<NoteHeaderProps> = ({ darkMode }) => (
  <h1
    className={` text-center mb-4 text-2xl font-bold ${
      darkMode ? "text-white" : "text-gray-800"
    }`}
  >
    Privnote
  </h1>
);

export default Header;
