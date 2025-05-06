"use client"
import { useState, useEffect, useRef } from "react"

interface ScreenCalibrationProps {
  onConfirmCalibration: (scale: number) => void
}

const ID_WIDTH_MM = 85.6 


export default function ScreenCalibration({
  onConfirmCalibration,
}: ScreenCalibrationProps) {
  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(300)
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (frameRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (frameRef.current) {
          setWidth(frameRef.current.offsetWidth)
          setHeight(frameRef.current.offsetHeight)
        }
      })
      resizeObserver.observe(frameRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [])

  const confirmID = () => {
    const mmPerPixel = ID_WIDTH_MM / width
    alert(`Scale: ${mmPerPixel.toFixed(2)} mm/px`)
    onConfirmCalibration(mmPerPixel)
  }

  return (
    <div className="flex flex-col items-center mt-6 space-y-4">
      <h2 className="font-bold text-2xl text-center text-black">
        Screen Calibration
      </h2>
      <p className="text-center text-gray-800">
        Fit the frame below to a physical ID card, then click "Confirm".
      </p>
      <div
        className="border-2 resize overflow-auto rounded-xl border-stone-800"
        ref={frameRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
      <div className="mt-4">
        <button
          onClick={confirmID}
          className="px-6 py-2 bg-green-700 text-white rounded-xl hover:bg-green-600"
        >
          Confirm Calibration
        </button>
      </div>
    </div>
  )
}