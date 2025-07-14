import React from 'react'
import { FaUser, FaRegClock, FaClipboardList } from 'react-icons/fa'
import { motion } from 'framer-motion'

// Utility for formatting timestamps
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const ActivityLogTable = ({ data }) => {
  return (
    <>
      {data.map((ele, index) => (
        <motion.tr
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
          className="hover:bg-blue-50 transition border-b last:border-b-0"
        >
          <td className="px-4 py-3 whitespace-nowrap text-gray-500 font-semibold text-center">{index + 1}</td>
          <td className="px-4 py-3 whitespace-nowrap flex items-center gap-2 justify-center text-center">
            <FaUser className="text-blue-400" /> {ele.username}
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-center">{ele.email || '-'}</td>
          <td className="px-4 py-3 whitespace-normal text-gray-700 text-center flex items-center gap-2 justify-center">
            <FaClipboardList className="text-green-500" /> {ele.activity}
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-gray-400 text-center">
            <FaRegClock className="inline mr-1" /> {formatTimestamp(ele.time_stamp)}
          </td>
        </motion.tr>
      ))}
    </>
  )
}

export default ActivityLogTable