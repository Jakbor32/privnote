import { FunctionComponent } from "react";

interface ButtonsProps {
  darkMode: boolean;
  onCreateNote: () => void;
  onClearNote: () => void;
  onOpenAdvanced: () => void;
  onOpenUploadFile: () => void;
}

const Buttons: FunctionComponent<ButtonsProps> = ({
  darkMode,
  onCreateNote,
  onClearNote,
  onOpenAdvanced,
  onOpenUploadFile,
}) => (
  <div className="flex flex-wrap justify-center gap-6 mb-4">
    <button
      className={`px-6 py-2 font-semibold rounded shadow ${
        darkMode
          ? "text-white bg-stone-800 border border-gray-800 hover:bg-stone-900"
          : "text-black bg-white hover:bg-stone-200"
      }`}
      onClick={onCreateNote}
    >
      Create
    </button>
    <button
      className={`px-6 py-2 font-semibold rounded shadow ${
        darkMode
          ? "text-white bg-stone-800 border border-gray-800 hover:bg-stone-900"
          : "text-black bg-white hover:bg-stone-200"
      }`}
      onClick={onClearNote}
    >
      Clear
    </button>
    <button
      className={`px-6 py-2 font-semibold rounded shadow ${
        darkMode
          ? "text-white bg-stone-800 border border-gray-800 hover:bg-stone-900"
          : "text-black bg-white hover:bg-stone-200"
      }`}
      onClick={onOpenAdvanced}
    >
      Advanced
    </button>
    <button
      className={`relative px-6 py-2 font-semibold rounded shadow ${
        darkMode
        ? "text-white bg-stone-800 border border-gray-800 hover:bg-stone-900"
        : "text-black bg-white hover:bg-stone-200"
      }`}
      onClick={onOpenUploadFile}
      >
      Upload file
      <span className="absolute block pl-2 pr-2 text-[.75rem] bg-yellow-600 rounded-full -right-3 -top-2 animate-pulse">NEW</span>
    </button>
  </div>
);

export default Buttons;
