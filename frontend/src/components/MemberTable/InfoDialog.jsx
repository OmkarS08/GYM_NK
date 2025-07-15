import React from "react";
import { FaTimesCircle, FaUserCircle, FaIdCard, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import HistoryModal from "./HistoryModal";

const InfoDialog = ({ open, member, showAadhar, setShowAadhar, onClose }) => {
  const [showHistory, setShowHistory] = useState(false);

  if (!open || !member) return null;

  if (showHistory) {
    return (
      <HistoryModal
        open={showHistory}
        history={member.history || []}
        onBack={() => setShowHistory(false)}
        onClose={onClose}
      />
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="relative w-full max-w-md sm:max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-8 overflow-y-auto max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl transition z-10"
            onClick={onClose}
            aria-label="Close"
            style={{ touchAction: "manipulation" }}
          >
            <FaTimesCircle />
          </button>

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-4">
            {member.profilePicUrl ? (
              <motion.img
                src={member.profilePicUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow mb-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
            ) : (
              <FaUserCircle className="text-blue-500 mb-2" size={60} />
            )}
            <h2 className="text-2xl font-bold text-blue-700 tracking-wide cursor-pointer">{member.name}</h2>
            <span className="text-xs text-gray-400">{member.email || "Member"}</span>
            {/* Aadhar Card Button */}
            {member.aadharFrontUrl && (
              <motion.button
                className="mt-2 flex items-center gap-2 px-4 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-semibold"
                whileHover={{ scale: 1.07 }}
                onClick={() => setShowAadhar((prev) => !prev)}
              >
                <FaIdCard />
                {showAadhar ? "Hide Aadhar" : "View Aadhar"}
                {showAadhar ? <FaEyeSlash /> : <FaEye />}
              </motion.button>
            )}
          </div>

          {/* Aadhar Card Images */}
          <AnimatePresence>
            {showAadhar && (
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {member.aadharFrontUrl && (
                  <img
                    src={member.aadharFrontUrl}
                    alt="Aadhar Front"
                    className="w-64 max-w-full h-40 object-contain rounded-lg border shadow"
                  />
                )}
                {member.aadharBackUrl && (
                  <img
                    src={member.aadharBackUrl}
                    alt="Aadhar Back"
                    className="w-64 max-w-full h-40 object-contain rounded-lg border shadow"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Member Info Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700 text-sm">
            <div className="font-semibold">Age:</div>
            <div>{member.age}</div>
            <div className="font-semibold">Gender:</div>
            <div>{member.gender}</div>
            <div className="font-semibold">Mobile:</div>
            <div>{member.mobile}</div>
            <div className="font-semibold">Package:</div>
            <div>{member.package} months</div>
            <div className="font-semibold">Start Date:</div>
            <div>{member.startDate1}</div>
            <div className="font-semibold">End Date:</div>
            <div>{member.endDate}</div>
            <div className="font-semibold">Status:</div>
            <div>
              {new Date(member.endDate) > new Date() ? (
                <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                  <svg className="w-3 h-3 fill-green-500" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                  <svg className="w-3 h-3 fill-red-500" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                  Inactive
                </span>
              )}
            </div>
            {member.aadhar && (
              <>
                <div className="font-semibold">Aadhar:</div>
                <div>{member.aadhar}</div>
              </>
            )}
            {member.paymentMethod && (
              <>
                <div className="font-semibold">Payment:</div>
                <div>{member.paymentMethod}</div>
              </>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
              onClick={() => setShowHistory(true)}
            >
              View History
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InfoDialog; 