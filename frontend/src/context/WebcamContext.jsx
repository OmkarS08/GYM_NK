import React, { createContext, useContext, useState } from 'react';

const WebcamContext = createContext();

export const useWebcam = () => {
  const context = useContext(WebcamContext);
  if (!context) {
    throw new Error('useWebcam must be used within a WebcamProvider');
  }
  return context;
};

export const WebcamProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCaptureType, setCurrentCaptureType] = useState(null);
  const [onCaptureCallback, setOnCaptureCallback] = useState(null);

  const openWebcamModal = (captureType, callback) => {
    setCurrentCaptureType(captureType);
    setOnCaptureCallback(() => callback);
    setIsModalOpen(true);
  };

  const closeWebcamModal = () => {
    setIsModalOpen(false);
    setCurrentCaptureType(null);
    setOnCaptureCallback(null);
  };

  const handleCapture = (imageSrc) => {
    if (onCaptureCallback) {
      onCaptureCallback(imageSrc);
    }
    closeWebcamModal();
  };

  const value = {
    isModalOpen,
    currentCaptureType,
    openWebcamModal,
    closeWebcamModal,
    handleCapture
  };

  return (
    <WebcamContext.Provider value={value}>
      {children}
    </WebcamContext.Provider>
  );
}; 