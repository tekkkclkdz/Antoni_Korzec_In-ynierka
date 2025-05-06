import React, { useState } from "react";

type ScaleSelectorProps = {
  onScaleChange: (scale: string) => void;
};

const ScaleSelector: React.FC<ScaleSelectorProps> = ({ onScaleChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [chosenScale, setChosenScale] = useState<string | null>(null);

  const scales = ["LogMAR", "Decimal (VA)", "MAR", "3m", "20ft"];

  const handleSelectScale = (scale: string) => {
    setChosenScale(scale);
    setShowModal(false);
    onScaleChange(scale);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1
        onClick={() => setShowModal(true)}
        className={`text-xl font-bold mb-4 transition-all duration-500 cursor-pointer ${
          chosenScale ? "text-blue-900" : "text-blue-400 hover:text-blue-800"
        }`}
      >
        {chosenScale ? `Chosen scale: ${chosenScale}` : "Choose scale"}
      </h1>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-50 bg-opacity-60 z-50">
          <div className="bg-blue-800 rounded-lg shadow-lg p-6 space-y-4 w-80">
            <h2 className="text-lg font-semibold text-white text-center">
              Select a Scale
            </h2>
            <ul className="space-y-3">
              {scales.map((scale) => (
                <li key={scale}>
                  <button
                    onClick={() => handleSelectScale(scale)}
                    className="w-full px-4 py-2 text-left text-white bg-blue-600
                  hover:bg-blue-500 rounded-lg focus:ring-2 focus:ring-blue-300"
                  >
                    {scale}
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

export default ScaleSelector;