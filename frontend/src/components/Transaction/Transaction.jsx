import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import TransactionCount from './TransactionCount'
import TranasctionTable from './TranasctionTable'
import { FaMoneyCheckAlt, FaFilter } from 'react-icons/fa'
import { motion } from 'framer-motion'
import api from '../../api/api'
const Transaction = () => {
    const [transData, setTransData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [countData, setCountData] = useState(['']);
    const [searchQuery, setSearchQuery] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('All');

    useEffect(() => {
        api.get('/transaction/getTransaction')
            .then(res => {
                if (res.status === 200) {
                    setTransData(res.data)
                    console.log(res.data);
                }
                else {
                    console.log(res.status);
                }
            })
            .catch(err => console.log(err))

        api.get('/transaction/getCountTrans')
            .then(res => {
                if (res.status === 200) {
                    setCountData(res.data);
                }
                else {
                    console.log(res.status);
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        let filtered = transData;
        if (searchQuery) {
            filtered = filtered.filter((transaction) =>
                transaction.member_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (paymentFilter !== 'All') {
            filtered = filtered.filter((transaction) =>
                transaction.payment_method === paymentFilter
            );
        }
        setFilteredData(filtered);
    }, [searchQuery, paymentFilter, transData]);

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
                    <FaMoneyCheckAlt className="text-blue-500 text-2xl" />
                    <span className="text-xl font-bold text-gray-700">Transactions</span>
                </motion.div>
                <div className="p-4">
                    <TransactionCount countData={countData} />
                    {/* Search and filter input */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-2 mb-4 items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <input
                            type="text"
                            className="px-4 py-2 mt-4 border rounded-lg w-full border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            placeholder="Search by member name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="flex items-center gap-2 mt-4">
                            <FaFilter className="text-blue-500" />
                            <select
                                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                                value={paymentFilter}
                                onChange={e => setPaymentFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="UPI">UPI</option>
                                <option value="Cash">Cash</option>
                            </select>
                        </div>
                    </motion.div>
                    <TranasctionTable data={filteredData} />
                </div>
            </div>
        </div>
    )
}

export default Transaction