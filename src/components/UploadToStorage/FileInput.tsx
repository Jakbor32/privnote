import React, { ChangeEvent, useRef } from "react";

interface FileInputProps {
  fileName: string | null;
  fileUrl: string | null;
  onFileChange: (file: File | null) => void;
  darkMode: boolean;
}

const FileInput: React.FC<FileInputProps> = ({
  fileName,
  fileUrl,
  onFileChange,
  darkMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onFileChange(selectedFile);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!fileUrl) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files?.[0] || null;
    onFileChange(selectedFile);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isDisabled = !!fileUrl;

  return (
    <div
      onClick={isDisabled ? undefined : handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full p-5 py-12 border-2 border-dashed rounded-lg text-center cursor-pointer ${
        darkMode ? "border-gray-400" : "border-gray-700"
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        type="file"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
        disabled={isDisabled}
      />
      <span
        className={`text-lg font-medium ${!fileName ? "animate-pulse" : ""}`}
      >
        {fileName || "Click or drag a file here"}
      </span>
      <span className="absolute bottom-0 opacity-50">Max size: 50MB</span>
    </div>
  );
};

export default FileInput;
