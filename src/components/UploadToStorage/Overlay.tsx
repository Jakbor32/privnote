import React from "react";

const Overlay: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div
    className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50"
    onClick={onClose}
  ></div>
);

export default Overlay;
