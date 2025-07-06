import React from 'react'
import { useNavigate } from 'react-router-dom'
import logActivity from '../../globalFunction/ActivityLog'
import Swal from 'sweetalert2'
import { FaHome, FaUsers, FaUserPlus, FaUserTie, FaHotTub, FaBell, FaExchangeAlt, FaListAlt, FaCog, FaSignOutAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Navbar = () => {
    const isAdmin = localStorage.getItem('admin') === 'true';
    const navigate = useNavigate()

    const handleClick = (event) => {
        if (event.target.name === '') {
            Swal.fire({
                title: "Are you sure want to Logout?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes,Logout"
            }).then((result) => {
                if (result.isConfirmed) {
                    logActivity(localStorage.getItem('loginId'), 'Logged Out');
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('loginId');
                    localStorage.removeItem('admin');
                    navigate('/');
                }
            });
        }
        else {
            navigate(`/${event.target.name}`)
        }
    }

    // Animation variants for framer-motion
    const navVariants = {
        hidden: { x: -100, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    const navItemVariants = {
        hover: { scale: 1.05, backgroundColor: "#374151" }
    };

    return (
        <motion.div
            className="hidden md:flex flex-col w-64 bg-gray-800"
            initial="hidden"
            animate="visible"
            variants={navVariants}
        >
            <div className="flex items-center justify-center h-16 bg-gray-900">
                <img className='mx-2' src="2DPNG.png" alt="logo" width="40" height="40" />
                <span className="text-white font-bold uppercase text-lg">NK Gym Dashboard</span>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
                <nav className="flex-1 px-2 py-4 bg-gray-800">
                    <motion.a
                        href="#"
                        className="flex items-center px-4 py-2 text-gray-100 rounded-lg mb-1"
                        name='Dashboard'
                        onClick={handleClick}
                        whileHover="hover"
                        variants={navItemVariants}
                    >
                        <FaHome className="mx-2 text-xl" />
                        Home
                    </motion.a>
                    <motion.a
                        href="#"
                        className="flex items-center px-4 py-2 text-gray-100 rounded-lg mb-1"
                        name='Members'
                        onClick={handleClick}
                        whileHover="hover"
                        variants={navItemVariants}
                    >
                        <FaUsers className="mx-2 text-xl" />
                        Member
                    </motion.a>
                    <motion.a
                        href="#"
                        className="flex items-center px-4 py-2 text-gray-100 rounded-lg mb-1"
                        name='AddMember'
                        onClick={handleClick}
                        whileHover="hover"
                        variants={navItemVariants}
                    >
                        <FaUserPlus className="mx-2 text-xl" />
                        Add Member
                    </motion.a>
                    {isAdmin && (
                        <motion.a
                            href="#"
                            className="flex items-center px-4 py-2 text-gray-100 rounded-lg mb-1"
                            name='StaffMember'
                            onClick={handleClick}
                            whileHover="hover"
                            variants={navItemVariants}
                        >
                            <FaUserTie className="mx-2 text-xl" />
                            Staff Member
                        </motion.a>
                    )}
                    <motion.a
                        href="#"
                        className="flex items-center px-4 py-2 text-gray-100 rounded-lg mb-1"
                        name='steamBath'
                        onClick={handleClick}
                        whileHover="hover"
                        variants={navItemVariants}
                    >
                        <FaHotTub className="mx-2 text-xl" />
                        Steam Bath
                    </motion.a>
                    <motion.a
                        href="#"
                        className="flex items-center px-4 py-2 text-gray-100 rounded-lg mb-1"
                        name='Notification'
                        onClick={handleClick}
                        whileHover="hover"
                        variants={navItemVariants}
                    >
                        <FaBell className="mx-2 text-xl" />
                        Notification
                    </motion.a>
                    <motion.a
                        href="#"
                        className="flex items-center px-4 py-2 text-gray-100 rounded-lg mb-1"
                        name='Transaction'
                        onClick={handleClick}
                        whileHover="hover"
                        variants={navItemVariants}
                    >
                        <FaExchangeAlt className="mx-2 text-xl" />
                        Transaction
                    </motion.a>
                    <motion.a
                        href="#"
                        className="flex items-center px-4 py-2 text-gray-100 rounded-lg mb-1"
                        name='ActivityLogs'
                        onClick={handleClick}
                        whileHover="hover"
                        variants={navItemVariants}
                    >
                        <FaListAlt className="mx-2 text-xl" />
                        Activity Logs
                    </motion.a>
                    {isAdmin && (
                        <motion.a
                            href="#"
                            className="flex items-center px-4 py-2 text-gray-100 rounded-lg mb-1"
                            name='Setting'
                            onClick={handleClick}
                            whileHover="hover"
                            variants={navItemVariants}
                        >
                            <FaCog className="mx-2 text-xl" />
                            Setting
                        </motion.a>
                    )}
                    <motion.a
                        href="#"
                        className="flex items-center px-4 py-2 text-gray-100 rounded-lg mt-2"
                        name=''
                        onClick={handleClick}
                        whileHover="hover"
                        variants={navItemVariants}
                    >
                        <FaSignOutAlt className="mx-2 text-xl" />
                        Logout
                    </motion.a>
                </nav>
            </div>
        </motion.div>
    )
}

export default Navbar