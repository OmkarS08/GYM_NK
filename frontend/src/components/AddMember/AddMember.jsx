import React from 'react'
import Navbar from '../Navbar/Navbar'
import MemberForm from '../MemberForm/MemberForm'

const AddMember = () => {

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 ">
          <div className='flex-button-container'>
          </div>
        </div>
        <div className="p-4">
          <MemberForm />
        </div>
      </div>

    </div>
  )
}

export default AddMember