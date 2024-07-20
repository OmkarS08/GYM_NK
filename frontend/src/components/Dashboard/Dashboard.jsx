import React from 'react'
import DashboardCompo from '../DashboardCompo/DashboardCompo'
import Navbar from '../Navbar/Navbar'
const Dashboard = () => {

  return (
    <div class="flex h-screen bg-gray-100">
      <Navbar/>
      <div class="flex flex-col flex-1 overflow-y-auto">
        <div class="flex items-center justify-between h-16 bg-white border-b border-gray-200">
        </div>
        <div class="p-4">
          <DashboardCompo />
        </div>
      </div>

    </div>

  )
}

export default Dashboard