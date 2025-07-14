import React, { useEffect } from 'react'
import Navbar from '../Navbar/Navbar'
import { useState } from 'react';
import NotificationEndDateTable from './NotificationEndDateTable';
import api from '../../api/api';
const Notification = () => {

  const [data, setData] = useState([]);
  const[packageExpiredData , setPackageExpiredData] = useState([]);

  useEffect(() => {
    api.get(`/members/packageEnding`)
      .then(res => {
        if (res.status === 200) {
          setData(res.data)
        }
        else {
          console.log(res.status)
        }
      }).catch(err => console.log(err))
  },[])

  useEffect(() => {
    api.get(`/members/packageExpired`)
      .then(res => {
        if (res.status === 200) {
          setPackageExpiredData(res.data)
        }
        else {
          console.log(res.status)
        }
      }).catch(err => console.log(err))
  },[])

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 ">
          <div className='flex-button-container'>
          </div>
        </div>
        <div className="p-4">
        <div className="flex justify-center mb-5">
              <label
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-white min-w-5xl"
              >Members Nearing Package EndDate</label>
            </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EndDate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days left</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">

              {!data || data.length === 0 ? (
                <tr>
                  <td colSpan="6" className='text-center'>No Data Available</td>
                </tr>
              ) : <NotificationEndDateTable data={data}/>}

            </tbody>
          </table>
          <div className='my-4'>
          <div className='flex justify-center mb-5'>
          <label
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-white min-w-5xl"
            >Members  Package  Expired </label>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days left</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {!packageExpiredData || packageExpiredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className='text-center'>No Data Available</td>
                </tr>
              ) : <NotificationEndDateTable data={packageExpiredData}/>}
            </tbody>
           </table>
           </div>
        </div>
      </div>

    </div>
  )
}

export default Notification