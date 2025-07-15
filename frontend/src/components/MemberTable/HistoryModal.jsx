import React from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const getMonthBadge = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const colors = {
    Jan: 'bg-blue-400', Feb: 'bg-pink-400', Mar: 'bg-green-400', Apr: 'bg-yellow-400',
    May: 'bg-purple-400', Jun: 'bg-orange-400', Jul: 'bg-red-400', Aug: 'bg-indigo-400',
    Sep: 'bg-teal-400', Oct: 'bg-fuchsia-400', Nov: 'bg-amber-400', Dec: 'bg-cyan-400',
  };
  return (
    <span className={`inline-block px-2 py-1 text-xs font-bold text-white rounded-full shadow ${colors[month] || 'bg-gray-300'}`}>{month}</span>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const HistoryModal = ({ open, history, onBack, onClose }) => {
  if (!open) return null;
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
          className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-0 overflow-y-auto max-h-[90vh]"
        >
          {/* Clean Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-2xl">
            <button
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-lg font-bold"
              onClick={onBack}
              aria-label="Back"
            >
              <FaArrowLeft /> Back
            </button>
            <h2 className="text-xl font-bold text-gray-800 flex-1 text-center tracking-wide">Renewal History</h2>
            <button
              className="text-gray-400 hover:text-blue-600 text-2xl transition"
              onClick={onClose}
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
          {/* Table */}
          <div className="overflow-x-auto p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Renewal Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Month</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Package</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Start</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">End</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history && history.length > 0 ? (
                  history.map((h, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2 font-semibold text-blue-700">{formatDate(h.renewalDate)}</td>
                      <td className="px-4 py-2">{getMonthBadge(h.renewalDate)}</td>
                      <td className="px-4 py-2 font-bold">{h.packageName}</td>
                      <td className="px-4 py-2 text-pink-600 font-bold">₹{h.amount}</td>
                      <td className="px-4 py-2 text-gray-700">{formatDate(h.startDate)}</td>
                      <td className="px-4 py-2 text-gray-700">{formatDate(h.endDate)}</td>
                      <td className="px-4 py-2 text-yellow-700 font-semibold">{h.paymentMethod}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-4">No renewal history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HistoryModal; 