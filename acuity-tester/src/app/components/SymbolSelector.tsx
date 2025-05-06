import React, { useState } from "react";

const LETTERS = ["D", "H", "K", "N", "O", "R", "S", "V", "Z"]
const E_SYMBOLS = ["E", "EL", "EU", "ED", "EU"]
const LANDOLT = ["CD", "CL", "CR", "CU", "CD"]

type SymbolSelectorProps = {
  onSymbolSetChange: (symbols: string[], symbolType: string) => void;
};

const SymbolSelector: React.FC<SymbolSelectorProps> = ({ onSymbolSetChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [chosenSet, setChosenSet] = useState<string | null>(null);

  const symbolSets = [
    { name: "Letters", value: LETTERS, type: "letters" },
    { name: "E Symbols", value: E_SYMBOLS, type: "e" },
    { name: "Landolt Rings", value: LANDOLT, type: "c" },
  ];

  const handleSelectSet = (set: { name: string; value: string[]; type: string }) => {
    setChosenSet(set.name);
    onSymbolSetChange(set.value, set.type);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1
        onClick={() => setShowModal(true)}
        className={`text-xl font-bold mb-4 transition-all duration-500 cursor-pointer ${
          chosenSet ? "text-blue-900" : "text-blue-400 hover:text-blue-800"
        }`}
      >
        {chosenSet ? `Chosen symbols: ${chosenSet}` : "Choose symbols"}
      </h1>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-50 bg-opacity-60 z-50">
          <div className="bg-blue-800 rounded-lg shadow-lg p-6 space-y-4 w-80">
            <h2 className="text-lg font-semibold text-white text-center">
              Select a Symbol Set
            </h2>
            <ul className="space-y-3">
              {symbolSets.map((set) => (
                <li key={set.name}>
                  <button
                    onClick={() => handleSelectSet(set)}
                    className="w-full px-4 py-2 text-left text-white bg-blue-600 hover:bg-blue-500 
                    rounded-lg focus:ring-2 focus:ring-blue-300"
                  >
                    {set.name}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 px-4 py-2 text-center bg-blue-400 text-white rounded-lg hover:bg-blue-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbolSelector;