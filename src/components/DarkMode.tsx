import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

interface DarkModeProps {
  defaultDarkMode?: boolean;
  children: React.ReactNode;
}

function DarkMode({ defaultDarkMode = false, children }: DarkModeProps) {
  const [darkMode, setDarkMode] = useState(defaultDarkMode);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  return (
    <div>
      <div className="fixed right-0 flex justify-end p-4">
        <button onClick={toggleDarkMode} className="text-2xl">
          {darkMode ? <FaSun color="white" /> : <FaMoon />}
        </button>
      </div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { darkMode });
        }
        return child;
      })}
    </div>
  );
}

export default DarkMode;
