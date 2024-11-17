import React from "react";

interface TextRevealTWProps {
  darkMode: boolean;
}

export const TextRevealTW: React.FC<TextRevealTWProps> = ({ darkMode }) => {
  const text = "Encrypted using Crypto-JS AES"; 

  return (
    <h1
      className={`overflow-hidden text-xl font-bold leading-10 ${
        darkMode ? "text-gray-200" : ""
      }`}
    >
      {text.match(/./gu)!.map((char, index) => (
        <span
          className="inline-block opacity-0 animate-text-reveal [animation-fill-mode:backwards]"
          key={`${char}-${index}`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {char === " " ? "\u00A0" : char} 
        </span>
      ))}
    </h1>
  );
};
