import React, { useEffect } from 'react'
import Navbar from '../Navbar/Navbar'
import { useState } from 'react';
import NotificationEndDateTable from './NotificationEndDateTable';
import api from '../../api/api';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import HamburgerButton from '../HamburgerButton/HamburgerButton';
const Notification = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState([]);
  const [packageExpiredData, setPackageExpiredData] = useState([]);

  useEffect(() => {
    api.get(`/members/packageEnding`)
      .then(res => {
        if (res.status === 200) {
          setData(res.data)
        }
        else {
          console.log(res.status)
        }
      }).catch(err => console.log(err))
  }, [])

  useEffect(() => {
    api.get(`/members/packageExpired`)
      .then(res => {
        if (res.status === 200) {
          setPackageExpiredData(res.data)
        }
        else {
          console.log(res.status)
        }
      }).catch(err => console.log(err))
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar
        isOpen={sidebarOpen}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
      />
      <AnimatePresence>
        {!sidebarOpen && (
          <HamburgerButton onClick={() => setSidebarOpen(true)} />
        )}
      </AnimatePresence>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 ">
          <div className='flex-button-container'>
          </div>
        </div>
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-8"
            >
              <label className="px-6 py-3 text-lg font-bold border border-blue-200 rounded-lg bg-blue-50 text-blue-700 shadow-sm">
                Members Nearing Package EndDate
              </label>
            </motion.div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EndDate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days left</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {!data || data.length === 0 ? (
                    <tr>
                      <td colSpan="6" className='text-center'>No Data Available</td>
                    </tr>
                  ) : <NotificationEndDateTable data={data} />}
                </tbody>
              </table>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='my-8 flex justify-center'
            >
              <label className="px-6 py-3 text-lg font-bold border border-red-200 rounded-lg bg-red-50 text-red-700 shadow-sm">
                Members Package Expired
              </label>
            </motion.div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days left</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {!packageExpiredData || packageExpiredData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className='text-center'>No Data Available</td>
                    </tr>
                  ) : <NotificationEndDateTable data={packageExpiredData} />}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Notification