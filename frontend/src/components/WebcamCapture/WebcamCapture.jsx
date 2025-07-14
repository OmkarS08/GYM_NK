// WebcamCapture.jsx
import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { FaCamera, FaSyncAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Responsive video constraints
const videoConstraints = (facingMode) => ({
  width: 400,
  height: 300,
  facingMode,
});

const WebcamCapture = ({ onCapture, label }) => {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("user"); // "user" = front, "environment" = rear
  const [captured, setCaptured] = useState(null);

  // Capture image from webcam
  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCaptured(imageSrc);
    if (onCapture) onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  // Toggle camera
  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setCaptured(null);
  };

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col items-center">
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <motion.div
        className="relative w-full flex justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints(facingMode)}
          className="rounded-lg shadow-lg w-full aspect-video object-cover"
        />
        {/* Toggle Camera Button */}
        <button
          type="button"
          onClick={handleToggleCamera}
          className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-blue-100 transition"
          title="Switch Camera"
        >
          <FaSyncAlt className="text-blue-500" />
        </button>
      </motion.div>
      {/* Capture Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.07 }}
        type="button"
        onClick={handleCapture}
        className="mt-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition"
        title="Capture"
      >
        <FaCamera size={22} />
      </motion.button>
      {/* Captured Image Preview */}
      <AnimatePresence>
        {captured && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <img
              src={captured}
              alt="Captured"
              className="w-40 h-40 object-cover rounded-lg border shadow"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WebcamCapture;