import React from "react";
import { useDarkMode } from "..//DarkMode";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`h-screen flex flex-col items-center w-full gap-4 p-4 ${
        darkMode ? "bg-[#15202B]" : "bg-[#7899A6]"
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
