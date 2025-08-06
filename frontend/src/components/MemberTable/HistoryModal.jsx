import React from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const getMonthBadge = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  const colors = {
    Jan: 'bg-blue-400', Feb: 'bg-pink-400', Mar: 'bg-green-400', Apr: 'bg-yellow-400',
    May: 'bg-purple-400', Jun: 'bg-orange-400', Jul: 'bg-red-400', Aug: 'bg-indigo-400',
    Sep: 'bg-teal-400', Oct: 'bg-fuchsia-400', Nov: 'bg-amber-400', Dec: 'bg-cyan-400',
  };
  return (
    <span className={`inline-block px-2 py-1 text-xs font-bold text-white rounded-full shadow ${colors[month] || 'bg-gray-300'}`}>
      {month} {year}
    </span>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Function to generate all months between first and last start date
const generateAllMonths = (history) => {
  if (!history || history.length === 0) return [];
  
  // Sort history by start date (not renewal date)
  const sortedHistory = [...history].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  
  const firstStartDate = new Date(sortedHistory[0].startDate);
  const lastStartDate = new Date(sortedHistory[sortedHistory.length - 1].startDate);
  
  const allMonths = [];
  const currentDate = new Date(firstStartDate);
  
  // Set to first day of month for consistent comparison
  currentDate.setDate(1);
  const endDate = new Date(lastStartDate);
  endDate.setDate(1);
  
  while (currentDate <= endDate) {
    const monthKey = currentDate.toISOString().slice(0, 7); // YYYY-MM format
    const monthName = currentDate.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
    
    // Check if there's a renewal that started in this month
    const renewalForMonth = sortedHistory.find(h => {
      const startDate = new Date(h.startDate);
      return startDate.getFullYear() === currentDate.getFullYear() && 
             startDate.getMonth() === currentDate.getMonth();
    });
    
    allMonths.push({
      monthKey,
      monthName,
      renewalDate: renewalForMonth ? renewalForMonth.renewalDate : null,
      startDate: renewalForMonth ? renewalForMonth.startDate : null,
      isRenewed: !!renewalForMonth,
      renewalData: renewalForMonth || null
    });
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return allMonths;
};

const HistoryModal = ({ open, history, onBack, onClose }) => {
  if (!open) return null;
  
  const allMonths = generateAllMonths(history);
  
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
          className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-0 overflow-y-auto max-h-[90vh]"
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
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase w-32">Month</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Renewal Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Package</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Start</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">End</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allMonths.length > 0 ? (
                  allMonths.map((month, idx) => (
                    month.isRenewed ? (
                      <tr key={month.monthKey} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-2 w-32">
                          {getMonthBadge(month.startDate || new Date(month.monthKey + '-01'))}
                        </td>
                        <td className="px-4 py-2">
                          <span className="font-semibold text-blue-700">{formatDate(month.renewalDate)}</span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="font-bold">{month.renewalData.packageName}</span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-pink-600 font-bold">₹{month.renewalData.amount}</span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-gray-700">{formatDate(month.renewalData.startDate)}</span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-gray-700">{formatDate(month.renewalData.endDate)}</span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-yellow-700 font-semibold">{month.renewalData.paymentMethod}</span>
                        </td>
                        <td className="px-4 py-2">
                          {month.isRenewed ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {month.renewalData.notes && month.renewalData.notes.includes('Initial Membership') ? 'Joined' : 'Renewed'}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Not Renewed
                            </span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <tr key={month.monthKey} className="bg-red-50 hover:bg-red-100 transition">
                        <td className="px-4 py-2 w-32">
                          {getMonthBadge(new Date(month.monthKey + '-01'))}
                        </td>
                        <td colSpan="7" className="px-4 py-2 text-center">
                          <span className="text-lg font-bold text-red-600">
                            Not Renewed
                          </span>
                        </td>
                      </tr>
                    )
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-400 py-4">No renewal history found.</td>
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