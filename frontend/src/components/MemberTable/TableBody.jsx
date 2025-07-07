import React, { useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import EditMember from '../EditMember/EditMember'
import logActivity from '../../globalFunction/ActivityLog';
import { FaEdit, FaTrash, FaUserCircle, FaTimesCircle, FaIdCard, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TableBody = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  // For member info dialog
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoMember, setInfoMember] = useState(null);
  const [showAadhar, setShowAadhar] = useState(false);

  const handleEdit = (member) => {
    setCurrentMember(member);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setCurrentMember({
      ...currentMember,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Are you sure want to delete ${name}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`https://gym-royal-fitness.onrender.com/members/deleteMember/${id}`)
          .then(res => {
            if (res.status === 200) {
              Swal.fire({
                toast: true,
                position: 'top-end',
                title: "Deleted!",
                text: `${name} has been deleted.`,
                icon: "error",
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              logActivity(localStorage.getItem('loginId'), `Member Deleted -->${name}`)
              setTimeout(() => window.location.reload(), 1590)
            } else {
              console.error('failed');
            }
          })
          .catch(err => {
            console.error('Error:', err);
          });
      }
    });
  }

  // Open info dialog
  const handleNameClick = (member) => {
    setInfoMember(member);
    setInfoDialogOpen(true);
  };

  // Close info dialog
  const handleCloseInfoDialog = () => {
    setInfoDialogOpen(false);
    setInfoMember(null);
  };

  return (
    <>
      {!data || data.length === 0 ? (
        <tr>
          <td colSpan="6" className='text-center'>No Data Available</td>
        </tr>
      ) : (
        data.map((ele, index) => (
          <tr key={index}>
            <td
              className="px-6 py-4 whitespace-nowrap text-blue-700 font-semibold cursor-pointer hover:underline"
              onClick={() => handleNameClick(ele)}
            >
              {ele.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{ele.age}</td>
            <td className="px-6 py-4 whitespace-nowrap">{ele.gender}</td>
            <td className="px-6 py-4 whitespace-nowrap">{ele.package} months</td>
            <td className="px-6 py-4 whitespace-nowrap">{ele.startDate1}</td>
            <td className="px-6 py-4 whitespace-nowrap">{ele.endDate}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {
                new Date(ele.endDate) > new Date() ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <motion.button
                onClick={() => handleEdit(ele)}
                className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out relative"
                onMouseEnter={() => setHoveredBtn(`edit-${index}`)}
                onMouseLeave={() => setHoveredBtn(null)}
                whileHover={{ scale: 1.08 }}
              >
                {/* Hover text above the button */}
                {hoveredBtn === `edit-${index}` && (
                  <motion.span
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow z-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    Edit
                  </motion.span>
                )}
                <FaEdit size={20} />
              </motion.button>
              <motion.button
                onClick={() => handleDelete(ele.id, ele.name)}
                className="ml-2 px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out relative"
                onMouseEnter={() => setHoveredBtn(`delete-${index}`)}
                onMouseLeave={() => setHoveredBtn(null)}
                whileHover={{ scale: 1.08 }}
              >
                {/* Hover text above the button */}
                {hoveredBtn === `delete-${index}` && (
                  <motion.span
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow z-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    Delete
                  </motion.span>
                )}
                <FaTrash size={20} />
              </motion.button>
            </td>
          </tr>
        ))
      )}

      {/* Member Info Dialog */}
      <AnimatePresence>
        {infoDialogOpen && infoMember && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white font-sans rounded-2xl shadow-2xl border border-blue-100 p-8 w-full max-w-md relative"
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl transition"
                onClick={handleCloseInfoDialog}
                aria-label="Close"
              >
                <FaTimesCircle />
              </button>
              <div className="flex flex-col items-center mb-4">
                {/* Profile Picture */}
                {infoMember.profilePicUrl ? (
                  <motion.img
                    src={infoMember.profilePicUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow mb-2"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />
                ) : (
                  <FaUserCircle className="text-blue-500 mb-2" size={60} />
                )}
                <h2 className="text-2xl font-bold text-blue-700">{infoMember.name}</h2>
                <span className="text-xs text-gray-400">{infoMember.email || 'Member'}</span>
                {/* Aadhar Card Button */}
                {infoMember.aadharFrontUrl && (
                  <motion.button
                    className="mt-2 flex items-center gap-2 px-4 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-semibold"
                    whileHover={{ scale: 1.07 }}
                    onClick={() => setShowAadhar((prev) => !prev)}
                  >
                    <FaIdCard />
                    {showAadhar ? "Hide Aadhar" : "View Aadhar"}
                    {showAadhar ? <FaEyeSlash /> : <FaEye />}
                  </motion.button>
                )}
              </div>
              {/* Aadhar Card Images */}
              {showAadhar && (
                <motion.div
                  className="flex flex-col items-center mb-4 gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  {infoMember.aadharFrontUrl && (
                    <img
                      src={infoMember.aadharFrontUrl}
                      alt="Aadhar Front"
                      className="w-72 h-44 object-contain rounded-lg border shadow"
                    />
                  )}
                  {infoMember.aadharBackUrl && (
                    <img
                      src={infoMember.aadharBackUrl}
                      alt="Aadhar Back"
                      className="w-72 h-44 object-contain rounded-lg border shadow"
                    />
                  )}
                </motion.div>
              )}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700 text-sm">
                <div className="font-semibold">Age:</div>
                <div>{infoMember.age}</div>
                <div className="font-semibold">Gender:</div>
                <div>{infoMember.gender}</div>
                <div className="font-semibold">Mobile:</div>
                <div>{infoMember.mobile}</div>
                <div className="font-semibold">Package:</div>
                <div>{infoMember.package} months</div>
                <div className="font-semibold">Start Date:</div>
                <div>{infoMember.startDate1}</div>
                <div className="font-semibold">End Date:</div>
                <div>{infoMember.endDate}</div>
                <div className="font-semibold">Status:</div>
                <div>
                  {new Date(infoMember.endDate) > new Date() ? (
                    <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                      <svg className="w-3 h-3 fill-green-500" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                      <svg className="w-3 h-3 fill-red-500" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                      Inactive
                    </span>
                  )}
                </div>
                {infoMember.aadhar && (
                  <>
                    <div className="font-semibold">Aadhar:</div>
                    <div>{infoMember.aadhar}</div>
                  </>
                )}
                {infoMember.paymentMethod && (
                  <>
                    <div className="font-semibold">Payment:</div>
                    <div>{infoMember.paymentMethod}</div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isModalOpen && (
        <EditMember
          member={currentMember}
          handleChange={handleChange}
          handleClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}

export default TableBody