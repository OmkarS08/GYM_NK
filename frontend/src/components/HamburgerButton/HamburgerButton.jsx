import { FaBars } from 'react-icons/fa'
import { motion } from 'framer-motion'

const HamburgerButton = ({ onClick }) => (
  <motion.button
    key="hamburger"
    className="fixed top-8 left-0 z-50 md:hidden bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-r-full shadow-lg p-2 border border-blue-200 focus:outline-none flex items-center justify-center"
    initial={{ opacity: 0, x: -30, scale: 0.8 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: -30, scale: 0.8 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    onClick={onClick}
    aria-label="Open navigation menu"
    style={{ zIndex: 50 }}
  >
    <FaBars size={24} className="mr-1" />
    <span className="font-semibold text-sm hidden xs:inline">Menu</span>
  </motion.button>
);

export default HamburgerButton;