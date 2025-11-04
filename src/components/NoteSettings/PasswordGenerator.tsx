import React, { useState, useCallback } from "react";
import { useDarkMode } from "../DarkMode";
import { toast } from "react-hot-toast";

const PASSWORD_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

interface PasswordGeneratorProps {
  defaultLength?: number;
  onClose: () => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  defaultLength = 12,
  onClose,
}) => {
  const { darkMode } = useDarkMode();
  const [length, setLength] = useState(defaultLength);
  const [password, setPassword] = useState("");

  const generatePassword = useCallback(() => {
    let result = "";
    const charsLength = PASSWORD_CHARS.length;

    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * charsLength);
      result += PASSWORD_CHARS[idx];
    }

    setPassword(result);
  }, [length]);

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    toast.success("Password copied");
    onClose();
  };

  return (
    <div>
      <h2 className="mt-8 mb-4 text-lg font-bold">Generate password</h2>

      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">Length</label>
        <span className="text-xl font-semibold">{length}</span>
      </div>

      <input
        type="range"
        min={8}
        max={24}
        step={1}
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer mb-4
    ${darkMode ? "bg-stone-700" : "bg-gray-300"}
  `}
        style={{
          accentColor: darkMode ? "#ffffff" : "#2563eb",
        }}
      />

      <button
        onClick={generatePassword}
        className={`w-full px-3 py-2 mb-3 rounded-md hover:opacity-90 ${
          darkMode ? "text-white bg-stone-900" : "text-black bg-gray-300"
        }`}
      >
        Generate
      </button>

      <div className="flex gap-2 mb-4">
        <input
          readOnly
          value={password}
          className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
            darkMode
              ? "text-white bg-stone-800 border-gray-700"
              : "text-gray-700 bg-white border-gray-300"
          }`}
        />
        <button
          onClick={copyToClipboard}
          disabled={!password}
          className={`px-3 py-2 rounded-md hover:opacity-90 disabled:opacity-40 ${
            darkMode ? "text-white bg-stone-900" : "text-black bg-gray-300"
          }`}
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
