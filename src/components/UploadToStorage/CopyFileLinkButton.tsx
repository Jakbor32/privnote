import React from "react";

interface CopyFileLinkButtonProps {
  fileUrl: string | null;
  onCopy: () => void;
  darkMode: boolean;
}

const CopyFileLinkButton: React.FC<CopyFileLinkButtonProps> = ({
  fileUrl,
  onCopy,
  darkMode,
}) => {
  return (
    fileUrl && (
      <button
        onClick={onCopy}
        className={`mt-4 px-4 py-2 w-full rounded-md font-semibold transition-colors ${
          darkMode ? "text-white bg-green-900" : "text-black bg-green-300"
        }`}
      >
        Copy Link
      </button>
    )
  );
};

export default CopyFileLinkButton;
