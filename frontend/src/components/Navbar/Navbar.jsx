import React from 'react'
import { useNavigate } from 'react-router-dom'
import logActivity from '../../globalFunction/ActivityLog'
import Swal from 'sweetalert2'
import { motion, AnimatePresence } from 'framer-motion'
import { getNavLinks } from '../../globalFunction/NavLinks';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa'

const navLinks = getNavLinks();

const Navbar = ({ isOpen, onClose, onOpen }) => {

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
            if (onClose) onClose(); // Close mobile menu on navigation
        }
    }

    // Animation variants for framer-motion
    const navVariants = {
        hidden: { x: -250, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
        exit: { x: -250, opacity: 0, transition: { duration: 0.2 } }
    };

    const navItemVariants = {
        hover: { scale: 1.05, backgroundColor: "#374151" }
    };



    return (
        <>

            {/* Desktop Sidebar */}
            <motion.div
                className="hidden md:flex flex-col w-64 bg-gray-800 z-30"
                initial="hidden"
                animate="visible"
                variants={navVariants}
            >
                <div className="flex items-center justify-center h-16 bg-gray-900">
                    <img className='mx-2' src="Logo2.jpeg" alt="logo" width="40" height="40" />
                    <span className="text-white font-bold uppercase text-lg">Royal Fitness</span>
                </div>
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 bg-gray-800">
                        {navLinks.map(link => (
                            <motion.a
                                key={link.name}
                                href="#"
                                className="flex items-center px-4 py-2 text-gray-100 rounded-lg mb-1"
                                name={link.name}
                                onClick={handleClick}
                                whileHover="hover"
                                variants={navItemVariants}
                            >
                                {link.icon}
                                {link.label}
                            </motion.a>
                        ))}
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

            {/* Mobile Slide-in Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50"
                            onClick={onClose}
                        />
                        {/* Slide-in Nav */}
                        <motion.div
                            className="fixed top-0 left-0 w-64 h-full bg-gray-800 flex flex-col shadow-xl z-50"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={navVariants}
                        >
                            <div className="flex items-center justify-between h-16 bg-gray-900 px-4">
                                <div className="flex items-center gap-2">
                                    <img className='mx-2' src="Logo2.jpeg" alt="logo" width="36" height="36" />
                                    <span className="text-white font-bold uppercase text-lg">Royal Fitness</span>
                                </div>
                                <button
                                    className="text-white text-2xl focus:outline-none"
                                    onClick={onClose}
                                    aria-label="Close navigation menu"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="flex flex-col flex-1 overflow-y-auto">
                                <nav className="flex-1 px-2 py-4 bg-gray-800">
                                    {navLinks.map(link => (
                                        <motion.a
                                            key={link.name}
                                            href="#"
                                            className="flex items-center px-4 py-2 text-gray-100 rounded-lg mb-1"
                                            name={link.name}
                                            onClick={handleClick}
                                            whileHover="hover"
                                            variants={navItemVariants}
                                        >
                                            {link.icon}
                                            {link.label}
                                        </motion.a>
                                    ))}
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
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar