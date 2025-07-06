import React from 'react'
import { FaUser, FaRegClock, FaClipboardList } from 'react-icons/fa'
import { motion } from 'framer-motion'

const ActivityLogTable = ({ data }) => {
  return (
    <>
      {data.map((ele, index) => (
        <motion.tr
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
          className="hover:bg-blue-50 transition"
        >
          <td className="px-6 py-4 whitespace-nowrap text-center font-semibold text-gray-500">
            {index + 1}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center flex items-center gap-2 justify-center">
            <FaUser className="text-blue-400" /> {ele.username}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center flex items-center gap-2 justify-center">
            <FaClipboardList className="text-green-500" /> {ele.activity}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center flex items-center gap-2 justify-center">
            <FaRegClock className="text-gray-400" /> {ele.time_stamp}
          </td>
        </motion.tr>
      ))}
    </>
  )
}

export default ActivityLogTable