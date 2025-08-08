
import Navbar from '../Navbar/Navbar'
import FeeStrucutre from './FeeStrucutre';
import  { useState } from 'react'
import HamburgerButton from '../HamburgerButton/HamburgerButton'
import { AnimatePresence } from 'framer-motion' 
const Setting = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 ">
          <div className='flex-button-container'>
          </div>
        </div>
        <div className="p-4">
        <FeeStrucutre/>
      
        </div>
      </div>

    </div>
  )
}

export default Setting