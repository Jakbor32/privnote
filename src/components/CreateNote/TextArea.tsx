import { FunctionComponent } from "react";

interface TextareaProps {
  note: string;
  onChange: (value: string) => void;
  darkMode: boolean;
}

const Textarea: FunctionComponent<TextareaProps> = ({
  note,
  onChange,
  darkMode,
}) => (
  <textarea
    className={`w-full sm:w-4/5 md:w-3/5 xl:w-2/5 p-4 h-1/4 ${
      darkMode
        ? "bg-[#465555] border-[#465555] text-gray-200"
        : "bg-[#e7ed67] border-[#e7ed67]"
    } resize focus:outline-none border-4 max-w-full max-h-96 overflow-auto`}
    placeholder="Write your note here..."
    value={note}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default Textarea;