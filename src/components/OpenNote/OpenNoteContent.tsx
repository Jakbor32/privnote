import React from "react";

interface NoteContentProps {
  darkMode: boolean;
  noteContent: string;
  noteViews: string;
  copyToClipboard: () => void;
}

const NoteContent: React.FC<NoteContentProps> = ({
  darkMode,
  noteContent,
  copyToClipboard,
}) => (
    
  <>
    <textarea
      readOnly
      className={`w-full sm:w-4/5 md:w-3/5 xl:w-2/5 p-4 h-1/4 ${
        darkMode ? "bg-[#465555] border-[#465555] text-gray-200" : "bg-[#e7ed67] border-[#e7ed67]"
      }`}
      value={noteContent}
    />
    <div className="flex justify-center gap-6 mb-4">
      <button
        className={`px-6 py-2 font-semibold rounded shadow ${
          darkMode ? "text-white bg-stone-800 border border-gray-800 hover:bg-stone-900" : "text-black bg-white hover:bg-stone-200"
        }`}
        onClick={copyToClipboard}
      >
        Copy
      </button>
    </div>
  </>
);

export default NoteContent;
