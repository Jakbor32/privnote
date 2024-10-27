import React from "react";

interface DiscardButtonProps {
  onDiscard: () => void;
}

const DiscardButton: React.FC<DiscardButtonProps> = ({ onDiscard }) => {
  return (
    <button
      onClick={onDiscard}
      className={`ml-2 px-4 py-2 rounded-md font-semibold text-red-500`}
    >
      Discard
    </button>
  );
};

export default DiscardButton;
