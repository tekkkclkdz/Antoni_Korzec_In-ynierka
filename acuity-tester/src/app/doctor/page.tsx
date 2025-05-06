"use client"
import React, { useState, useEffect } from "react";
import { TestState } from "@/app/api/test/route";
import ScaleSelector from "../components/ScaleSelector";
import SymbolSelector from "../components/SymbolSelector";

function logMarToMAR(logmar: number): number {
  return Math.pow(10, logmar);
}

function logMarToDecimal(logmar: number): number {
  return 1 / logMarToMAR(logmar);
}

function logMarTo3mString(logmar: number): string {
  const decimalVA = logMarToDecimal(logmar);
  const denominator = (3 / decimalVA).toFixed(0);
  return `3/${denominator}`;
}

function logMarTo20ftString(logmar: number): string {
  const decimalVA = logMarToDecimal(logmar);
  const denominator = (20 / decimalVA).toFixed(0);
  return `20/${denominator}`;
}

function formatVisionValue(logmar: number, scale: string): string {
  switch (scale) {
    case "LogMAR":
      return logmar.toFixed(2);
    case "Decimal (VA)":
      return logMarToDecimal(logmar).toFixed(2);
    case "MAR":
      return logMarToMAR(logmar).toFixed(2);
    case "3m":
      return logMarTo3mString(logmar);
    case "20ft":
      return logMarTo20ftString(logmar);
    default:
      return logmar.toFixed(2);
  }
}

export default function DoctorPage() {
  const [testState, setTestState] = useState<TestState | null>(null);
  const [markedSymbols, setMarkedSymbols] = useState<number[]>([]);
  const [symbolSet, setSymbolSet] = useState<string[]>([]);
  const [symbolType, setSymbolType] = useState<string>("letters");
  const [selectedScale, setSelectedScale] = useState<string>("LogMAR");

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("/api/test")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setTestState(data);
          } else {
            setTestState(null);
          }
        });
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const initializeTest = async () => {
    if (symbolSet.length === 0) {
      alert("Please select a symbol set first!");
      return;
    }
    const newRow = getRandomRow(symbolSet, 5, symbolType);
    const newState: TestState = {
      symbolSet,
      symbolType,
      currentLogMar: 1.0,
      currentSymbols: newRow,
      correctCount: 0,
      isTestComplete: false,
      measurementScale: selectedScale,
    };
    await postTestState(newState);
    setTestState(newState);
    setMarkedSymbols([]);
  };

  const markSymbol = async (symbolIndex: number, isCorrect: boolean) => {
    if (!testState) return;
    const updatedCount = isCorrect ? testState.correctCount + 1 : testState.correctCount;
    const updatedState: TestState = {
      ...testState,
      correctCount: updatedCount,
    };
    await postTestState(updatedState);
    setTestState(updatedState);
    setMarkedSymbols((prev) => [...prev, symbolIndex]);
  };

  const nextRow = async () => {
    if (!testState) return;
  
    const {
      currentLogMar,
      correctCount,
      symbolSet,
      symbolType,
    } = testState;
  
    const pass_threshold = 3;
    let updatedState: TestState;
  
    if (correctCount >= pass_threshold) {
      const newLogMar = currentLogMar - 0.1;
      const newRow = getRandomRow(symbolSet, 5, symbolType);
      updatedState = {
        ...testState,
        currentLogMar: newLogMar,
        currentSymbols: newRow,
        correctCount: 0,
      };
      setMarkedSymbols([]);
    } else {
      const finalLogMar = currentLogMar - correctCount / 50;
      updatedState = {
        ...testState,
        isTestComplete: true,
        finalLogMar,
      };
    }
  
    await postTestState(updatedState);
    setTestState(updatedState);
  };
  

  const handleScaleChange = (scale: string) => {
    setSelectedScale(scale);
    if (testState) {
      const updatedState = { ...testState, measurementScale: scale };
      postTestState(updatedState);
      setTestState(updatedState);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-blue-50 w-screen h-screen">
      <ScaleSelector onScaleChange={handleScaleChange} />
      <SymbolSelector
        onSymbolSetChange={(set, type) => {
          setSymbolSet(set);
          setSymbolType(type);
        }}
      />
      <button
        onClick={initializeTest}
        className="text-xl font-bold text-blue-600 hover:text-blue-800 active:text-green-600 transition-all duration-300"
      >
        {testState ? "Restart Test" : "Start Test"}
      </button>
      {testState && (
        <div className="justify-center text-center items-center w-full max-w-2xl bg-blue-500 rounded-lg p-6 shadow-md mt-4">
          <p className="mb-4">
            <strong>Current logMAR:</strong>{" "}
            <span className="text-teal-400">{testState.currentLogMar.toFixed(2)}</span>
          </p>
          {selectedScale !== "LogMAR" && (
            <p className="mb-4">
              <strong>Current {selectedScale}:</strong>{" "}
              <span className="text-teal-400">
                {formatVisionValue(testState.currentLogMar, selectedScale)}
              </span>
            </p>
          )}
          <p className="mb-4">
            <strong>Correct Count:</strong>{" "}
            <span className="text-teal-400">{testState.correctCount}</span>
          </p>
          <p className="mb-4">
            <strong>Is Test Complete?</strong>{" "}
            <span className={testState.isTestComplete ? "text-green-500" : "text-red-500"}>
              {testState.isTestComplete ? "YES" : "NO"}
            </span>
          </p>
          {testState.isTestComplete && testState.finalLogMar !== undefined && (
            <p className="mb-4">
              <strong>Final logMAR:</strong>{" "}
              <span className="text-teal-400">{testState.finalLogMar.toFixed(2)}</span>
            </p>
          )}
          <div className="mt-4">
            <strong>Current Symbols:</strong>
            <div className="flex justify-center gap-4 mt-2">
              {testState.currentSymbols.map((symbol, idx) => (
                <span
                  key={idx}
                  className={`py-1 px-3 rounded shadow ${
                    markedSymbols.includes(idx)
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {symbol}
                </span>
              ))}
            </div>
          </div>
          {!testState.isTestComplete && (
            <div className="mt-6 space-y-3">
              <div className="flex gap-2 flex-wrap justify-center">
                {testState.currentSymbols.map((symbol, idx) => (
                  <button
                    key={idx}
                    onClick={() => markSymbol(idx, true)}
                    disabled={markedSymbols.includes(idx)}
                    className={`py-2 px-4 rounded-md shadow transition ${
                      markedSymbols.includes(idx)
                        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                  >
                    Mark {symbol} as Correct
                  </button>
                ))}
              </div>
              <button
                className="bg-orange-500 hover:bg-orange-400 text-white 
                py-2 px-6 rounded-md shadow-lg transition mt-4"
                onClick={nextRow}
              >
                Next Row
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getRandomRow(symbols: string[], count: number, symbolType?: string): string[] {
  if (symbolType === "c" && symbols.length < count) {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    return result;
  } else {
    const shuffled = [...symbols].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

async function postTestState(newState: TestState) {
  await fetch("/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newState),
  });
}