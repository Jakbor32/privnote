import React from "react";

interface NoteLinkBoxProps {
  link: string;
  darkMode: boolean;
}

const NoteLinkBox: React.FC<NoteLinkBoxProps> = ({ link, darkMode }) => (
  <p
    className={`w-full p-4 ${
      darkMode
        ? "bg-[#465555] border-[#465555] text-gray-200"
        : "bg-[#e7ed67] border-[#e7ed67]"
    } focus:outline-none border-4 overflow-hidden break-words`}
  >
    {link}
  </p>
);

export default NoteLinkBox;
