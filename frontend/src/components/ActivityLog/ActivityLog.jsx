import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import ActivityLogTable from './ActivityLogTable'
import { FaHistory } from 'react-icons/fa'
import { motion } from 'framer-motion'
import api from '../../api/api'
const ActivityLog = () => {
    const [data, setData] = useState(null)
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.get('/activityLog/getActivity')
            .then(res => {
                if (res.status === 200) {
                    setData(res.data)
                }
                else {
                    console.log(res.status)
                }
            })
            .catch(err => console.error(err))
    }, []
    )

    // Filtered data based on search
    const filteredData = data ? data.filter(
        ele =>
            (ele.username && ele.username.toLowerCase().includes(search.toLowerCase())) ||
            (ele.email && ele.email.toLowerCase().includes(search.toLowerCase())) ||
            (ele.activity && ele.activity.toLowerCase().includes(search.toLowerCase()))
    ) : [];

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-blue-100">
            <Navbar />
            <div className="flex flex-col flex-1 overflow-y-auto">
                <motion.div
                    className="flex items-center gap-3 h-16 bg-white border-b border-gray-200 px-6 shadow-sm"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaHistory className="text-blue-500 text-2xl" />
                    <span className="text-xl font-bold text-gray-700">Activity Log</span>
                </motion.div>
                <div className="p-4">
                    {/* Search/filter input above the table */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by user, email, or activity..."
                            className="px-4 py-2 border rounded w-full max-w-xs focus:outline-none focus:ring"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <motion.div
                        className="overflow-x-auto"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">
                                        User Name
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">
                                       -
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">
                                        Action
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">
                                        TimeStamp
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {!filteredData || filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className='text-center py-6 text-gray-400'>No Data Available</td>
                                    </tr>
                                ) : (
                                    <ActivityLogTable data={filteredData} />
                                )}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default ActivityLog