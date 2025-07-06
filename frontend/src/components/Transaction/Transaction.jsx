import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import TransactionCount from './TransactionCount'
import TranasctionTable from './TranasctionTable'
import axios from 'axios'
import { FaMoneyCheckAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Transaction = () => {
    const [transData, setTransData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [countData, setCountData] = useState(['']);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8081/transaction/getTransaction')
            .then(res => {
                if (res.status === 200) {
                    setTransData(res.data)
                }
                else {
                    console.log(res.status);
                }
            })
            .catch(err => console.log(err))

        axios.get('http://localhost:8081/transaction/getCountTrans')
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
        // Filter transactions based on search query
        const filtered = transData.filter((transaction) =>
            transaction.member_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, transData]);

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
                    {/* Search input */}
                    <motion.div
                        className="mb-4"
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
                    </motion.div>
                    <TranasctionTable data={filteredData} />
                </div>
            </div>
        </div>
    )
}

export default Transaction