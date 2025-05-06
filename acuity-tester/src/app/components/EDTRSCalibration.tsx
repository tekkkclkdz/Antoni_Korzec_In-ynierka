import React from "react";
import { TestState } from "@/app/api/test/route";

const BASE_HEIGHT_MM = 7.27;

interface ETDRSComponentProps {
  scale: number;             
  testState: TestState;      
  symbolType: string;        
  measurementScale: string;  
}


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

export default function ETDRSComponent({
  scale,
  testState,
  symbolType,
  measurementScale,
}: ETDRSComponentProps) {
  const { currentLogMar, currentSymbols } = testState;
  const symbolHeightPx = (BASE_HEIGHT_MM * Math.pow(10, currentLogMar)) / scale;

 
  const folder = symbolType === "e" ? "e" : symbolType === "c" ? "c" : "letters";

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="font-bold text-xl text-center text-black">ETDRS Chart</h2>
      <p className="text-gray-700">
        Current logMAR: <strong>{currentLogMar.toFixed(2)}</strong>
      </p>
      <p className="text-gray-700">
        Vision ({measurementScale}):{" "}
        <strong>{formatVisionValue(currentLogMar, measurementScale)}</strong>
      </p>
      <div className="flex flex-wrap justify-evenly items-center w-full gap-y-4">
        {currentSymbols.map((symbol, idx) => (
          <img
            key={idx}
            src={`/${folder}/${symbol}.svg`}
            alt={symbol}
            width={symbolHeightPx}
            height={symbolHeightPx}
          />
        ))}
      </div>
    </div>
  );
}