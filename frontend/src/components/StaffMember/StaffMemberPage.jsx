import React, { useState } from 'react'
import StaffMember from './StaffMember'
import Navbar from '../Navbar/Navbar'
import AddStaffMember from './AddStaffMember'
import HamburgerButton from '../HamburgerButton/HamburgerButton'
import { AnimatePresence } from 'framer-motion'
const StaffMemberPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [addStaff, setaddStaff] = useState(false)
  const AddStaffOpen = () => {
    setaddStaff(!addStaff)
  }
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
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200">
        </div>
        <div className="p-4">
          <div className='flex justify-center p-4  py-4'>
            <button
              onClick={AddStaffOpen}
              class=" border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline flex items-center">
              <svg className='mr-2' width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.3249 15.0763C12.8883 15.0257 12.4456 15 12 15C10.0188 15 8.09292 15.5085 6.52112 16.4465C5.30069 17.1749 4.34666 18.1307 3.74108 19.2183C3.46638 19.7117 3.79562 20.2902 4.34843 20.4054C7.85678 21.1365 11.4437 21.3594 15 21.074V21H14C12.3431 21 11 19.6569 11 18C11 16.5753 11.9932 15.3825 13.3249 15.0763Z" fill="#ffffff"></path> <path d="M18 14L18 22" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"></path> <path d="M22 18L14 18" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"></path> <circle cx="12" cy="8" r="5" fill="#ffffff"></circle> </g></svg>
              Add Staff Member
            </button>
          </div>
          <StaffMember />
          {addStaff ? <AddStaffMember handleClose={() => AddStaffOpen(false)} /> : ''}
        </div>
      </div>

    </div>

  )
}

export default StaffMemberPage