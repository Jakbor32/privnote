import React from "react";

interface Option {
  value: string;
  label: string;
}

interface ExpirationSelectorProps {
  expiryTime: string;
  setExpiryTime: (value: string) => void;
  darkMode: boolean;
  isOpenSelect: boolean;
  setIsOpenSelect: (value: boolean) => void;
}

const ExpirationSelector: React.FC<ExpirationSelectorProps> = ({
  expiryTime,
  setExpiryTime,
  darkMode,
  isOpenSelect,
  setIsOpenSelect,
}) => {
  const options: Option[] = [
    { value: "6h", label: "6 hours" },
    { value: "12h", label: "12 hours" },
    { value: "18h", label: "18 hours" },
    { value: "24h", label: "24 hours" },
  ];

  return (
    <div className="mt-4">
      <h2 className="mt-4 mb-2 text-lg font-bold">Select Expiration Time</h2>
      <div className="relative w-full">
        <div
          className={`px-3 py-2 mb-4 border rounded-md shadow-sm cursor-pointer ${
            darkMode
              ? "text-white bg-stone-800 border-gray-700"
              : "text-gray-700 bg-white border-gray-300"
          } ${isOpenSelect ? (darkMode ? "bg-stone-900" : "bg-gray-100") : ""}`}
          onClick={() => setIsOpenSelect(!isOpenSelect)}
        >
          {options.find((option) => option.value === expiryTime)?.label}
        </div>
        {isOpenSelect && (
          <div
            className={`absolute left-0 z-10 w-full mt-1 border rounded-md shadow-lg ${
              darkMode
                ? "bg-stone-800 border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-2 cursor-pointer ${
                  darkMode
                    ? "text-white hover:bg-stone-700"
                    : "text-gray-700 hover:bg-gray-300"
                } ${
                  expiryTime === option.value
                    ? darkMode
                      ? "bg-stone-700"
                      : "bg-gray-200 text-white"
                    : ""
                }`}
                onClick={() => {
                  setExpiryTime(option.value);
                  setIsOpenSelect(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpirationSelector;
