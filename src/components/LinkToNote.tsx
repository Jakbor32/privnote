import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface LinkToNoteProps {
  darkMode: boolean;
}

function LinkToNote({ darkMode }: LinkToNoteProps) {
  const [inputValue, setinputValue] = useState("https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html");

  const notify = () =>
    toast.success("Link copied!", {
      style: {
        borderRadius: "10px",
        background: darkMode ? "#333" : "#ABA",
        color: "#fff",
      },
    });
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputValue);
    notify();
  };

  return (
    <div
      className={`h-screen flex flex-col items-center w-full gap-4 p-4 ${
        darkMode ? "bg-[#15202B]" : "bg-[#7899A6]"
      }`}
    >
      <h1
        className={`mb-4 text-2xl font-bold text-center ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        Privnote
      </h1>
      <input readOnly
        className={`w-full  p-4  ${
          darkMode
            ? "bg-[#465555] border-[#465555] text-gray-200"
            : "bg-[#e7ed67] border-[#e7ed67]"
        } focus:outline-none  border-4 border-double`}
        value={inputValue}
        onChange={(e) => setinputValue(e.target.value)}
      />
      <div className="flex justify-center gap-6 mb-4">
        <button
          className={`px-6 py-2 font-semibold rounded shadow  ${
            darkMode
              ? "text-white bg-stone-800 border border-gray-800  hover:bg-stone-900"
              : "text-black bg-white hover:bg-stone-200"
          }`}
          onClick={copyToClipboard}
        >
          Copy
        </button>
        <button
          className={`px-6 py-2 font-semibold rounded shadow  ${
            darkMode
              ? "text-white bg-red-950  hover:opacity-85"
              : "text-white bg-red-900  hover:opacity-85"
          }`}
        >
          Destroy Note
        </button>
      </div>
      <footer
        className={`fixed text-center bottom-1 flex items-center gap-2 ${
          darkMode ? "text-gray-500" : "text-gray-300"
        }`}
      >
        <a
          className="hover:text-white hover:animate-pulse"
          href="https://github.com/Jakbor32"
        >
          <FaGithub size="20" />
        </a>
        <p>© 2024 Jakub Borowy</p>
      </footer>
      <Toaster position="top-left" reverseOrder={true} />
    </div>
  );
}

export default LinkToNote;
