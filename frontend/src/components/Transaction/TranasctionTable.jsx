import React from 'react'
import TransactionTableData from './TransactionTableData'
const TranasctionTable = ({data}) => {
  return (
    <div className='my-8'>
  <table className="min-w-full divide-y divide-gray-200 ">
    <thead>
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package in Months</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">paid Date</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Amount</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th> {/* New */}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">

      {!data || data.length === 0 ? (
        <tr>
          <td colSpan="9" className='text-center text-red-600 bg-white-200'>No Data Available</td>
        </tr>
      ) : <TransactionTableData data={data}/>}

    </tbody>
  </table></div>
  )
}

export default TranasctionTable