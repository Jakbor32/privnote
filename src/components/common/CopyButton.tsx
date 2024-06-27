import React from "react";
import toast from "react-hot-toast";

interface CopyButtonProps {
  copy: string;
  darkMode: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = ({ copy, darkMode }) => {
  const notify = () =>
    toast.success("Copied!", {
      style: {
        borderRadius: "10px",
        background: darkMode ? "#333" : "#ABA",
        color: "#fff",
      },
    });

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(copy);
    notify();
  };

  return (
    <button
      className={`px-6 py-2 font-semibold rounded shadow ${
        darkMode
          ? "text-white bg-stone-800 border border-gray-800 hover:bg-stone-900"
          : "text-black bg-white hover:bg-stone-200"
      }`}
      onClick={copyToClipboard}
    >
      Copy
    </button>
  );
};

export default CopyButton;
