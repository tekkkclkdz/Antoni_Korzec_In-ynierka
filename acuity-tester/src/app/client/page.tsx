"use client"
import React, { useState, useEffect } from "react";
import { TestState } from "@/app/api/test/route";
import ScreenCalibration from "../components/ScreenCalibration";
import ETDRSComponent from "../components/EDTRSCalibration";

export default function ClientPage() {
  const [testState, setTestState] = useState<TestState | null>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [isCalibrated, setIsCalibrated] = useState(false);

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

  const handleCalibrationConfirmed = (calculatedScale: number) => {
    setScale(calculatedScale);
    setIsCalibrated(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Client Page</h1>
      {!isCalibrated && (
        <ScreenCalibration onConfirmCalibration={handleCalibrationConfirmed} />
      )}
      {isCalibrated && testState && !testState.isTestComplete && scale && (
        <div className="mt-6">
          <ETDRSComponent
            scale={scale}
            testState={testState}
            symbolType={testState.symbolType}
            measurementScale={testState.measurementScale || "LogMAR"}
          />
        </div>
      )}
      {isCalibrated && testState?.isTestComplete && (
        <div className="mt-6 text-red-600 text-xl font-bold">
          The test is complete! Your result: {testState.finalLogMar?.toFixed(2)}
        </div>
      )}
      {isCalibrated && !testState && (
        <div className="mt-6 text-gray-600">No test is currently running.</div>
      )}
    </div>
  );
}