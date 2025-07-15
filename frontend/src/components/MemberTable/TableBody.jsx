import React, { useState } from 'react'

import Swal from 'sweetalert2';
import EditForm from '../EditMember/EditForm';
import logActivity from '../../globalFunction/ActivityLog';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { useMemberDialog } from '../../context/MemberDialogContext';

const TableBody = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const { openDialog } = useMemberDialog();

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
        api.post(`/members/deleteMember/${id}`)
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
    openDialog(member);
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

    </>
  )
}

export default TableBody