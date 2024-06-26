import React from "react";

interface RevealButtonProps {
  revealNote: () => void;
}

const RevealButton: React.FC<RevealButtonProps> = ({ revealNote }) => (
  <button
    onClick={revealNote}
    className="relative flex items-center justify-center w-full h-full p-4 overflow-hidden text-white transition-opacity bg-black bg-opacity-50 hover:bg-opacity-70"
  >
    <div className="absolute p-32 rounded-full hover:border-2 animate-ping"></div>
    <span className="text-xl font-semibold">Reveal Note</span>
  </button>
);

export default RevealButton;
