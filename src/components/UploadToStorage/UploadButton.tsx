import React from "react";

interface UploadButtonProps {
  fileName: string | null;
  isLoading: boolean;
  onUpload: () => void;
  onClose: () => void;
  darkMode: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  fileName,
  isLoading,
  onUpload,
  onClose,
  darkMode,
}) => (
  <div className="flex justify-between mt-6">
    <button
      onClick={fileName ? onUpload : onClose}
      className={`px-4 py-2 rounded-md font-semibold transition-colors ${
        darkMode ? "text-white bg-stone-900" : "text-black bg-gray-300"
      }`}
      disabled={isLoading}
    >
      {isLoading ? "Uploading..." : fileName ? "Upload" : "Close"}
    </button>
  </div>
);

export default UploadButton;
