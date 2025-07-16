import React, { useState } from 'react'
import DashboardCompo from '../DashboardCompo/DashboardCompo'
import Navbar from '../Navbar/Navbar'
import DashboardTChart from '../DashboardCompo/DashboardTChart'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import logActivity from '../../globalFunction/ActivityLog'
import DashboardPieChart from '../DashboardCompo/DashboardPieChart'
import { FaBars } from 'react-icons/fa'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const isadmin = localStorage.getItem('admin');

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Clear session on the client side
      logActivity(localStorage.getItem('loginId'), 'Logged Out');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginId'); // Clear user ID
      // Redirect to the login page
      navigate('/');
    }, 8 * 60 * 1000); // 8 minutes

    return () => clearTimeout(timeout); // Clear the timeout if the component unmounts
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop, overlay for mobile */}
      <Navbar
        isOpen={sidebarOpen}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
        isadmin={isadmin}
      />
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between h-14 md:h-16 bg-white border-b border-gray-200 px-3 md:px-6">
          {/* Hamburger for mobile only */}
          <button
            className="md:hidden text-2xl text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FaBars />
          </button>
          <span className="text-lg md:text-xl font-bold text-gray-700">Dashboard</span>
          <div className="w-8 md:w-12" /> {/* Spacer for alignment */}
        </div>
        <div className="p-2 sm:p-3 md:p-4">
          <DashboardCompo />
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full mt-3 md:mt-4">
            <div className="w-full md:w-1/2 flex-1 bg-white rounded-xl shadow p-2 sm:p-3 md:p-4 flex items-center justify-center">
              <DashboardPieChart />
            </div>
            <div className="w-full md:w-1/2 flex-1 bg-white rounded-xl shadow p-2 sm:p-3 md:p-4 flex items-center justify-center">
              <DashboardTChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard