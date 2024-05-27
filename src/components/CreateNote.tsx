import { FaGithub } from "react-icons/fa";

interface CreateNoteProps {
  darkMode: boolean;
}

function CreateNote({ darkMode }: CreateNoteProps) {
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
      <textarea
        className={`w-4/5 md:w-3/5 xl:w-2/5 p-4 h-1/4 ${
          darkMode
            ? "bg-[#465555] border-[#465555] text-gray-200"
            : "bg-[#e7ed67] border-[#e7ed67]"
        } resize focus:outline-none  border-4 border-double`}
        placeholder="Write your note here..."
      ></textarea>
      <div className="flex justify-center gap-6 mb-4">
        <button
          className={`px-6 py-2 font-semibold rounded shadow  ${
            darkMode
              ? "text-white bg-stone-800 border border-gray-800  hover:bg-stone-900"
              : "text-black bg-white hover:bg-stone-200"
          }`}
        >
          Create
        </button>
        <button
          className={`px-6 py-2 font-semibold rounded shadow  ${
            darkMode
              ? "text-white bg-stone-800 border border-gray-800  hover:bg-stone-900"
              : "text-black bg-white hover:bg-stone-200"
          }`}
        >
          Clear
        </button>
      </div>
      <footer
        className={`fixed text-center bottom-1 flex items-center gap-2 ${
          darkMode ? "text-gray-500" : "text-gray-300"
        }`}
      >
        <a className="hover:text-white hover:animate-pulse"href="https://github.com/Jakbor32">
            <FaGithub size="20" />
          </a>
        <p>
          © 2024 Jakub Borowy
        </p>
      </footer>
    </div>
  );
}

export default CreateNote;
