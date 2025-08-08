    // Nav links (to avoid repetition)
import { FaHome, FaUsers, FaUserPlus, FaUserTie,  FaBell, FaExchangeAlt, FaListAlt, FaCog } from 'react-icons/fa'
 const isAdmin = localStorage.getItem('admin') === 'true';
   export const navLinks = [
        { name: 'Dashboard', label: 'Home', icon: <FaHome className="mx-2 text-xl" /> },
        { name: 'Members', label: 'Member', icon: <FaUsers className="mx-2 text-xl" /> },
        { name: 'AddMember', label: 'Add Member', icon: <FaUserPlus className="mx-2 text-xl" /> },
        ...(isAdmin ? [{ name: 'StaffMember', label: 'Staff Member', icon: <FaUserTie className="mx-2 text-xl" /> }] : []),
        // { name: 'steamBath', label: 'Steam Bath', icon: <FaHotTub className="mx-2 text-xl" /> },
        { name: 'Notification', label: 'Notification', icon: <FaBell className="mx-2 text-xl" /> },
        { name: 'Transaction', label: 'Transaction', icon: <FaExchangeAlt className="mx-2 text-xl" /> },
        { name: 'ActivityLogs', label: 'Activity Logs', icon: <FaListAlt className="mx-2 text-xl" /> },
        ...(isAdmin ? [{ name: 'Setting', label: 'Setting', icon: <FaCog className="mx-2 text-xl" /> }] : []),
    ];