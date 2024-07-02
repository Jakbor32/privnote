import React from "react";
import { FaGithub } from "react-icons/fa";

interface NoteFooterProps {
  darkMode: boolean;
}

const Footer: React.FC<NoteFooterProps> = ({ darkMode }) => (
  <footer
    className={`fixed text-center bottom-1 flex items-center gap-2 ${
      darkMode ? "text-gray-500" : "text-gray-300"
    }`}
  >
    <a
      className="hover:text-white hover:animate-pulse"
      href="https://github.com/Jakbor32"
    >
      <FaGithub size="20" />
    </a>
    <p>© 2024 Jakub Borowy</p>
  </footer>
);

export default Footer;
