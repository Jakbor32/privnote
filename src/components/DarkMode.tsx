import React, { useState, useEffect, useContext } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

interface DarkModeProps {
  defaultDarkMode?: boolean;
  children: React.ReactNode;
}

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = React.createContext<DarkModeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useDarkMode = (): DarkModeContextType => useContext(DarkModeContext);

function DarkModeProvider({ defaultDarkMode = false, children }: DarkModeProps) {
  const [darkMode, setDarkMode] = useState<boolean>(defaultDarkMode);

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
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode} className="text-2xl">
      {darkMode ? <FaSun color="white" /> : <FaMoon />}
    </button>
  );
}

function DarkMode({ defaultDarkMode = false, children }: DarkModeProps) {
  return (
    <DarkModeProvider defaultDarkMode={defaultDarkMode}>
      <div>
        <div className="fixed right-0 flex justify-end p-4">
          <DarkModeToggle />
        </div>
        {children}
      </div>
    </DarkModeProvider>
  );
}

export default DarkMode;
