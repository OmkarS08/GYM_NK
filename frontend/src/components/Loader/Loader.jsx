import React from 'react';
import { motion } from 'framer-motion';
import { FaDumbbell, FaHeartbeat, FaRunning, FaFire } from 'react-icons/fa';

const Loader = ({ text = "Working out..." }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
    <div className="flex space-x-8 mb-4">
      <motion.div
        animate={{
          y: [0, -18, 0],
          boxShadow: [
            "0 4px 24px 0 rgba(59,130,246,0.15)",
            "0 8px 32px 0 rgba(55,65,81,0.18)",
            "0 4px 24px 0 rgba(59,130,246,0.15)"
          ]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.1,
          ease: "easeInOut"
        }}
        className="p-4 rounded-full bg-white bg-opacity-80"
      >
        <FaDumbbell
          size={54}
          className="text-blue-500 drop-shadow-lg"
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -18, 0],
          boxShadow: [
            "0 4px 24px 0 rgba(220,38,38,0.15)",
            "0 8px 32px 0 rgba(220,38,38,0.18)",
            "0 4px 24px 0 rgba(220,38,38,0.15)"
          ]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.1,
          ease: "easeInOut",
          delay: 0.2
        }}
        className="p-4 rounded-full bg-white bg-opacity-80"
      >
        <FaHeartbeat
          size={54}
          className="text-red-500 drop-shadow-lg"
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -18, 0],
          boxShadow: [
            "0 4px 24px 0 rgba(22,163,74,0.15)",
            "0 8px 32px 0 rgba(22,163,74,0.18)",
            "0 4px 24px 0 rgba(22,163,74,0.15)"
          ]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.1,
          ease: "easeInOut",
          delay: 0.4
        }}
        className="p-4 rounded-full bg-white bg-opacity-80"
      >
        <FaRunning
          size={54}
          className="text-green-500 drop-shadow-lg"
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -18, 0],
          boxShadow: [
            "0 4px 24px 0 rgba(249,115,22,0.15)",
            "0 8px 32px 0 rgba(249,115,22,0.18)",
            "0 4px 24px 0 rgba(249,115,22,0.15)"
          ]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.1,
          ease: "easeInOut",
          delay: 0.6
        }}
        className="p-4 rounded-full bg-white bg-opacity-80"
      >
        <FaFire
          size={54}
          className="text-orange-500 drop-shadow-lg"
        />
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="text-base font-medium text-gray-700 bg-white bg-opacity-80 px-4 py-2 rounded-full shadow"
    >
      {text}
    </motion.div>
  </div>
);

export default Loader;