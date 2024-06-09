import React, { useState } from "react";
import { useDarkMode } from "./DarkMode";

interface NoteViewProps {
  selectedViews: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

const NoteView: React.FC<NoteViewProps> = ({ selectedViews, onSelect, onClose }) => {
  const { darkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '5', label: '5' },
  ];

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div>
      <h2 className="mt-8 mb-4 text-lg font-bold">Select number of views</h2>
      <div className="relative w-full">
        <div
          className={`px-3 py-2 mb-4 border rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'text-white bg-stone-800 border-gray-700' : 'text-gray-700 bg-white border-gray-300'} ${isOpen ? (darkMode ? 'bg-stone-900' : 'bg-gray-100') : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {options.find(option => option.value === selectedViews)?.label}
        </div>
        {isOpen && (
          <div className={`absolute left-0 z-10 w-full mt-1 border rounded-md shadow-lg ${darkMode ? 'bg-stone-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            {options.map(option => (
              <div
                key={option.value}
                className={`px-3 py-2 cursor-pointer ${darkMode ? 'text-white hover:bg-stone-700' : 'text-gray-700 hover:bg-gray-300'} ${selectedViews === option.value ? (darkMode ? 'bg-stone-700' : 'bg-gray-200 text-white') : ''}`}
                onClick={() => {
                  handleSelect(option.value);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className={`px-3 py-2 cursor-pointer rounded-md hover:opacity-90 ${darkMode ? 'text-white bg-stone-900' : 'text-black bg-gray-300'}`}
        onClick={onClose}
      >
        Confirm Views
      </button>
    </div>
  );
};

export default NoteView;
