import { useEffect, useState } from 'react'
import TableBody from './TableBody'
import api from '../../api/api'
import { FaFilter, FaChevronDown, FaCheck } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const MemberTable = () => {

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all'); // New state for status filter
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        api.get('/members/getMember')
            .then(res => {
                if (res.status === 200) {
                    setData(res.data)
                    console.log(res.data)
                    setFilteredData(res.data)

                }
                else {
                    console.log(res.status)
                }
            })
            .catch(err => console.error(err))
    }, [])

    // Function to check member status
    const getMemberStatus = (endDate) => {
        const now = new Date();
        const endDateObj = new Date(endDate);
        const threeMonthsAfterEnd = new Date(endDateObj);
        threeMonthsAfterEnd.setMonth(threeMonthsAfterEnd.getMonth() + 3);
        
        if (endDateObj > now) {
            return 'Active';
        } else if (now <= threeMonthsAfterEnd) {
            return 'Inactive';
        } else {
            return 'Invalid';
        }
    };

    // Combined filter function for both search and status
    const applyFilters = (searchValue, statusValue) => {
        let filtered = data;
        
        // Apply search filter
        if (searchValue) {
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }
        
        // Apply status filter
        if (statusValue !== 'all') {
            filtered = filtered.filter(item => 
                getMemberStatus(item.endDate) === statusValue
            );
        }
        
        setFilteredData(filtered);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        applyFilters(value, statusFilter);
    }

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        applyFilters(searchTerm, status);
        setIsDropdownOpen(false);
    }

    const getStatusDisplayName = (status) => {
        switch(status) {
            case 'all': return 'All Members';
            case 'Active': return 'Active Members';
            case 'Inactive': return 'Inactive Members';
            case 'Invalid': return 'Invalid Members';
            default: return 'All Members';
        }
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'Active': return 'text-green-600';
            case 'Inactive': return 'text-red-600';
            case 'Invalid': return 'text-gray-600';
            default: return 'text-gray-700';
        }
    }

    const filterOptions = [
        { value: 'all', label: 'All Members', icon: '👥', color: 'text-gray-600' },
        { value: 'Active', label: 'Active Members', icon: '✅', color: 'text-green-600' },
        { value: 'Inactive', label: 'Inactive Members', icon: '⚠️', color: 'text-red-600' },
        { value: 'Invalid', label: 'Invalid Members', icon: '❌', color: 'text-gray-600' }
    ];

    return (
        <>
            <>
                <div className="flex justify-start mb-4 ">
                    <input
                        type="search"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="px-4 py-2 mt-4   w-full border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>
            </>
            
            {/* Status Filter Dropdown */}
            <div className="relative mb-4">
                <motion.button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-64 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center space-x-3">
                        <FaFilter className="text-gray-500" />
                        <span className={`font-medium ${getStatusColor(statusFilter)}`}>
                            {getStatusDisplayName(statusFilter)}
                        </span>
                    </div>
                    <motion.div
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FaChevronDown className="text-gray-500" />
                    </motion.div>
                </motion.button>

                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        >
                            {filterOptions.map((option, index) => (
                                <motion.div
                                    key={option.value}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <button
                                        onClick={() => handleStatusFilter(option.value)}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                                            statusFilter === option.value ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">{option.icon}</span>
                                            <span className={`font-medium ${option.color}`}>
                                                {option.label}
                                            </span>
                                        </div>
                                        {statusFilter === option.value && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            >
                                                <FaCheck className="text-blue-500" />
                                            </motion.div>
                                        )}
                                    </button>
                                    {index < filterOptions.length - 1 && (
                                        <div className="border-b border-gray-100"></div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">

                    {filteredData.length === 0 ? <tr>
                        <td colSpan="8" className='text-center text-red-500 w-full'>Member Not Present </td></tr> : <TableBody data={filteredData} setData={setData} />}
                </tbody>
            </table>
        </>
    )
}

export default MemberTable