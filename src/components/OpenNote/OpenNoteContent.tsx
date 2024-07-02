import React from "react";
import CopyButton from "../common/CopyButton";

interface NoteContentProps {
  darkMode: boolean;
  noteContent: string;
  noteViews: string;
}

const NoteContent: React.FC<NoteContentProps> = ({
  darkMode,
  noteContent,
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
    <CopyButton copy={noteContent} darkMode={darkMode} />
    </div>
  </>
);

export default NoteContent;
