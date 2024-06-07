import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import supabase from "../../utils/supabaseConfig";
import { useDarkMode } from "./DarkMode";

interface LinkToNoteProps {
  noteId: string;
  
}

function LinkToNote({ noteId }: LinkToNoteProps): JSX.Element {
  const { darkMode } = useDarkMode();
  const [link, setLink] = useState<string>("");

  useEffect(() => {
    setLink(`https://privnote-app.vercel.app/${noteId}`);
  }, [noteId]);

  const notify = () =>
    toast.success("Link copied!", {
      style: {
        borderRadius: "10px",
        background: darkMode ? "#333" : "#ABA",
        color: "#fff",
      },
    });

  const handleDestroyNote = async (): Promise<void> => {
    try {
      const { error } = await supabase
        .from("privnote")
        .delete()
        .eq("note_uid", noteId);
      if (error) {
        throw new Error(error.message);
      }
      toast.success("Note destroyed successfully!", {
        style: {
          borderRadius: "10px",
          background: darkMode ? "#333" : "#ABA",
          color: "#fff",
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        toast.error("Failed to destroy note!");
      } else {
        console.error("Error:", err);
        toast.error("Error occurred!");
      }
    }
  };

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(link);
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
      <p
        className={`w-full p-4 ${
          darkMode
            ? "bg-[#465555] border-[#465555] text-gray-200"
            : "bg-[#e7ed67] border-[#e7ed67]"
        } focus:outline-none border-4`}
      >{link}</p>
      <div className="flex justify-center gap-6 mb-4">
        <button
          className={`px-6 py-2 font-semibold rounded shadow ${
            darkMode
              ? "text-white bg-stone-800 border border-gray-800 hover:bg-stone-900"
              : "text-black bg-white hover:bg-stone-200"
          }`}
          onClick={copyToClipboard}
        >
          Copy
        </button>
        <button
          className={`px-6 py-2 font-semibold rounded shadow ${
            darkMode
              ? "text-white bg-red-950 hover:opacity-85"
              : "text-white bg-red-900 hover:opacity-85"
          }`}
          onClick={handleDestroyNote}
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
