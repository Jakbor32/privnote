import React, { ChangeEvent, useState } from "react";
import { IoMdTime, IoMdNotifications } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { useDarkMode } from "./DarkMode";

interface AdvancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTime: string;
  handleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

interface CustomSelectProps {
  selectedTime: string;
  onSelect: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ selectedTime, onSelect }) => {
  const { darkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: '2h', label: '2 hours' },
    { value: '4h', label: '4 hours' },
    { value: '10h', label: '10 hours' },
    { value: '24h', label: '1 day' },
  ];



  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div
        className={`px-3 py-2 mb-4 border rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'text-white bg-stone-800 border-gray-700' : 'text-gray-700 bg-white border-gray-300'} ${isOpen ? (darkMode ? 'bg-stone-900' : 'bg-gray-100') : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find(option => option.value === selectedTime)?.label}
      </div>
      {isOpen && (
        <div className={`absolute left-0 z-10 w-full mt-1 border rounded-md shadow-lg ${darkMode ? 'bg-stone-800 border-gray-700' : 'bg-white border-gray-300'}`}>
          {options.map(option => (
            <div
              key={option.value}
              className={`px-3 py-2 cursor-pointer ${darkMode ? 'text-white hover:bg-stone-700' : 'text-gray-700 hover:bg-gray-300'} ${selectedTime === option.value ? (darkMode ? 'bg-stone-700' : 'bg-gray-200 text-white') : ''}`}
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
  );
};

const AdvancedModal: React.FC<AdvancedModalProps> = ({
  isOpen,
  onClose,
  selectedTime,
  handleChange,
}) => {
  const { darkMode } = useDarkMode();
    
  if (!isOpen) return null;

  const handleCustomSelectChange = (value: string) => {
    handleChange({
      target: { value } 
    } as ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className={`relative z-10 p-6 rounded shadow-lg w-80 ${darkMode ? 'bg-stone-800 text-white' : 'bg-white text-black'}`}>
        <div className={`top-0 left-0 flex justify-between p-3 rounded-lg cursor-pointer  ${darkMode ? 'bg-stone-900 text-white' : 'bg-gray-300 text-black'}`}>
        <IoMdTime size={20} />
        <RiLockPasswordLine size={20} className="opacity-25" />
        <FaEye  size={20} className="opacity-25" />
        <IoMdNotifications size={20} className="opacity-25"  />
        </div>
        <h2 className="mt-8 mb-4 text-lg font-bold">Select note time</h2>
        <CustomSelect
          selectedTime={selectedTime}
          onSelect={handleCustomSelectChange}
        />
        <button
          className={`px-3 py-2 cursor-pointer rounded-md hover:opacity-90 ${darkMode ? 'text-white bg-stone-900' : 'text-black bg-gray-300'}`}
          onClick={onClose}
        >
         Confirm Time
        </button>
      </div>
    </div>
  );
};

export default AdvancedModal;
