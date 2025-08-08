import React from 'react'
import Navbar from '../Navbar/Navbar'
import MemberTable from '../MemberTable/MemberTable'
import Swal from 'sweetalert2'
import { useEffect } from 'react'
import HamburgerButton from '../HamburgerButton/HamburgerButton'
import { AnimatePresence } from 'framer-motion'
const Members = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  useEffect(() => {
    const showSuccessAlert = localStorage.getItem('showSuccessAlert');
    if (showSuccessAlert === 'true') {
      Swal.fire({
        toast:true,
        position: "top-end",
        icon: "success",
        title: "New Member has been added",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar:"True"
      });
      localStorage.removeItem('showSuccessAlert');  // Remove flag
    }
  }, []);
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
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <span className="text-lg md:text-xl font-bold text-gray-700">Members</span>

        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 ">
          <div className='flex-button-container'>
          </div>
        </div>
      <div className="p-4">
        <MemberTable/>
      </div>
    </div>

  </div>
  )
}

export default Members