"use client";

import { useState } from "react";

export default function ChartGenerator() {
    const [distance, setDistance] = useState(4);
    const [rows, setRows] = useState(10);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleGenerate = async () => {
        setError("");
        if (rows < 1 || rows > 20) {
            setError("Number of rows must be between 1 and 20.");
            return;
        }
        if (distance < 0.5 || distance > 10) {
            setError("Distance must be between 0.5 and 10 meters.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ distance, rows }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Error generating PDF");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "etdrs_chart.pdf";
            a.click();
            window.URL.revokeObjectURL(url);
            setShowModal(false);
        } catch (err: any) {
            setError(err.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
      <h3
        onClick={() => setShowModal(true)}
        className="text-2xl font-semibold text-blue-900 hover:underline hover:text-blue-600 cursor-pointer"
      >
        Generate PDF
      </h3>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="bg-blue-800 text-white rounded-lg shadow-lg p-6 space-y-4 w-80">
            <h3 className="text-lg font-semibold text-center">Chart Settings</h3>

            <div className="space-y-2">
              <label className="block text-sm">Distance (m)</label>
              <input
                type="number"
                value={distance}
                min={0.5}
                max={10}
                step={0.5}
                onChange={(e) => setDistance(parseFloat(e.target.value))}
                className="w-full px-3 py-1.5 text-black rounded-md text-sm focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm">Number of rows</label>
              <input
                type="number"
                value={rows}
                min={1}
                max={20}
                onChange={(e) => setRows(parseInt(e.target.value))}
                className="w-full px-3 py-1.5 text-black rounded-md text-sm focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {error && <p className="text-red-300 text-sm">{error}</p>}

            <div className="flex justify-between gap-4 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-1/2 px-3 py-1.5 text-sm bg-blue-400 
                hover:bg-blue-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-1/2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500
                 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
    );
}