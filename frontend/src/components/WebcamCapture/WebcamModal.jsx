import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { FaCamera, FaSyncAlt, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useWebcam } from "../../context/WebcamContext";

// Responsive video constraints
const videoConstraints = (facingMode) => ({
  width: 400,
  height: 300,
  facingMode,
});

const WebcamModal = () => {
  const { isModalOpen, currentCaptureType, closeWebcamModal, handleCapture } = useWebcam();
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("user"); // "user" = front, "environment" = rear
  const [captured, setCaptured] = useState(null);

  // Capture image from webcam
  const onCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCaptured(imageSrc);
  }, [webcamRef]);

  // Confirm capture and close modal
  const confirmCapture = () => {
    if (captured) {
      handleCapture(captured);
      setCaptured(null);
    }
  };

  // Toggle camera
  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setCaptured(null);
  };

  // Close modal and reset state
  const handleClose = () => {
    setCaptured(null);
    setFacingMode("user");
    closeWebcamModal();
  };

  const getCaptureTypeLabel = () => {
    switch (currentCaptureType) {
      case 'profile':
        return 'Profile Photo';
      case 'aadharFront':
        return 'Aadhar Front';
      case 'aadharBack':
        return 'Aadhar Back';
      default:
        return 'Photo';
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Capture {getCaptureTypeLabel()}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Webcam */}
            <div className="relative w-full flex justify-center mb-4">
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
            </div>

            {/* Capture Button */}
            <div className="flex justify-center mb-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.07 }}
                type="button"
                onClick={onCapture}
                className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition"
                title="Capture"
              >
                <FaCamera size={22} />
              </motion.button>
            </div>

            {/* Captured Image Preview */}
            <AnimatePresence>
              {captured && (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <img
                    src={captured}
                    alt="Captured"
                    className="w-full h-48 object-cover rounded-lg border shadow"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              {captured && (
                <button
                  onClick={confirmCapture}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                  Use Photo
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WebcamModal; 