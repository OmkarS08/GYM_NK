import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import logActivity from '../../globalFunction/ActivityLog';
import { FaUser, FaLock, FaUserShield, FaUserTie, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AddStaffMember = ({ handleClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    admin: '0',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const { email, password, confirmPassword, admin } = formData;

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'All fields are required!',
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match!',
      });
      return;
    }

    axios.post('https://gym-royal-fitness.onrender.com/auth/register', {
      email,
      password,
      admin: admin === '1'
    }).then(res => {
      if (res.status === 200) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "New staff member has been added",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        logActivity(localStorage.getItem('loginId'), `New Staff Member --> ${email} has been added`);

        handleClose();
        setTimeout(() => window.location.reload(), 1590);
      }
    })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response?.data?.message || 'Something went wrong!',
        });
      });
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white border rounded-2xl px-10 py-8 mx-auto my-10 w-96 shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 flex items-center justify-center gap-2">
            <FaUserTie className="text-blue-500" /> Add Staff Member
          </h2>
          <form onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-4">
              {/* Email Input */}
              <div className="mb-2">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                  <FaUser /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                  required
                  placeholder="Enter staff email"
                />
              </div>

              {/* Password Input */}
              <div className="mb-2">
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                  <FaLock /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400 pr-10"
                    required
                    placeholder="Enter password"
                  />
                  <span
                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="mb-2">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                  <FaLock /> Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                  required
                  placeholder="Re-enter password"
                />
              </div>

              {/* Role Input */}
              <div className="mb-2">
                <label htmlFor="role" className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                  {formData.admin === '1' ? <FaUserShield /> : <FaUserTie />} Role
                </label>
                <select
                  id="admin"
                  name="admin"
                  value={formData.admin}
                  onChange={handleInputChange}
                  className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                >
                  <option value='0'>Staff</option>
                  <option value='1'>Admin</option>
                </select>
                <span className="text-xs text-gray-500 ml-1">
                  {formData.admin === '1'
                    ? "Admin can manage all data"
                    : "Staff has limited access"}
                </span>
              </div>

              {/* Submit/Cancel Buttons */}
              <div className="flex justify-center items-center mx-auto mt-4 gap-2">
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  Save
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddStaffMember;
