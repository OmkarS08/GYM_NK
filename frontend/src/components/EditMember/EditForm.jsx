import React, { useState } from 'react';
import { FaUser, FaPhone, FaVenusMars, FaCalendarAlt, FaMoneyBill, FaRupeeSign, FaWallet, FaCamera, FaUpload, FaChevronDown, FaIdCard } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/api';
import { useWebcam } from '../../context/WebcamContext';
import Loader from '../Loader/Loader';

const EditForm = ({ member, handleClose }) => {
  const [formData, setFormData] = useState({
    name: member.name || '',
    age: member.age || '',
    mobile: member.mobile || '',
    gender: member.gender || '',
    package: member.package || '',
    startDate: member.startDate || '',
    payment: member.paymentMethod || '',
    package_amount: member.transaction_package_amount || '',
    transaction_id: member.transaction_id,
    transaction_paid: member.transaction_amount_paid || '',
    cardio: member.cardio || 'with',
    profilePicUrl: member.profilePicUrl || '',
    aadharFrontUrl: member.aadharFrontUrl || '',
    aadharBackUrl: member.aadharBackUrl || '',
  });

  const [profilePicPreview, setProfilePicPreview] = useState(member.profilePicUrl || '');
  const [aadharFrontPreview, setAadharFrontPreview] = useState(member.aadharFrontUrl || '');
  const [aadharBackPreview, setAadharBackPreview] = useState(member.aadharBackUrl || '');
  const [uploading, setUploading] = useState({ profile: false, aadharFront: false, aadharBack: false });
  const [imageMethod, setImageMethod] = useState({ profile: 'upload', aadharFront: 'upload', aadharBack: 'upload' });
  const [showDropdown, setShowDropdown] = useState({ profile: false, aadharFront: false, aadharBack: false });
  const { openWebcamModal } = useWebcam();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading((prev) => ({ ...prev, [type]: true }));
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'profile') setProfilePicPreview(reader.result);
      if (type === 'aadharFront') setAadharFrontPreview(reader.result);
      if (type === 'aadharBack') setAadharBackPreview(reader.result);
    };
    reader.readAsDataURL(file);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('folder',
      type === 'profile'
        ? 'gym_members/profile'
        : type === 'aadharFront'
        ? 'gym_members/aadhar/front'
        : 'gym_members/aadhar/back'
    );
    try {
      const res = await api.post('/upload/image', formDataUpload, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (type === 'profile') setFormData((prev) => ({ ...prev, profilePicUrl: res.data.url }));
      if (type === 'aadharFront') setFormData((prev) => ({ ...prev, aadharFrontUrl: res.data.url }));
      if (type === 'aadharBack') setFormData((prev) => ({ ...prev, aadharBackUrl: res.data.url }));
    } catch {
      alert('Image upload failed');
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleWebcamCapture = async (img, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));
    if (type === 'profile') setProfilePicPreview(img);
    if (type === 'aadharFront') setAadharFrontPreview(img);
    if (type === 'aadharBack') setAadharBackPreview(img);
    const res = await fetch(img);
    const blob = await res.blob();
    const formDataUpload = new FormData();
    formDataUpload.append('file', blob, `${type}.jpg`);
    formDataUpload.append('folder',
      type === 'profile'
        ? 'gym_members/profile'
        : type === 'aadharFront'
        ? 'gym_members/aadhar/front'
        : 'gym_members/aadhar/back'
    );
    try {
      const uploadRes = await api.post('/upload/image', formDataUpload, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (type === 'profile') setFormData((prev) => ({ ...prev, profilePicUrl: uploadRes.data.url }));
      if (type === 'aadharFront') setFormData((prev) => ({ ...prev, aadharFrontUrl: uploadRes.data.url }));
      if (type === 'aadharBack') setFormData((prev) => ({ ...prev, aadharBackUrl: uploadRes.data.url }));
    } catch {
      alert('Image upload failed');
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const toggleDropdown = (type) => setShowDropdown((prev) => ({ ...prev, [type]: !prev[type] }));
  const setImageMethodFor = (type, method) => {
    setImageMethod((prev) => ({ ...prev, [type]: method }));
    setShowDropdown((prev) => ({ ...prev, [type]: false }));
  };
  const openCameraFor = (type) => openWebcamModal(type, (img) => handleWebcamCapture(img, type));

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await api.post(`/members/updateMember/${member.id}`, formData);
    handleClose();
  };

  const buttonVariants = { hover: { scale: 1.02 }, tap: { scale: 0.98 } };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-14"
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>

          {/* Profile Picture Upload Centered */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-blue-200 bg-gray-100 flex items-center justify-center overflow-hidden shadow">
                {profilePicPreview ? (
                  <img src={profilePicPreview} alt="Profile" className="object-cover w-full h-full" />
                ) : (
                  <FaUser className="text-5xl text-gray-300" />
                )}
                {uploading.profile && <Loader />}
              </div>
              {/* Dropdown for upload/camera */}
              <div className="mt-2 w-full">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('profile')}
                    className="w-28 flex items-center justify-center gap-2 px-3 py-1 border border-gray-300 rounded-full bg-white hover:border-blue-400 transition"
                  >
                    {imageMethod.profile === 'upload' ? <FaUpload /> : <FaCamera />}
                    {imageMethod.profile === 'upload' ? 'Upload' : 'Camera'}
                    <FaChevronDown className={`ml-1 transition-transform ${showDropdown.profile ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showDropdown.profile && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                      >
                        <button
                          type="button"
                          onClick={() => setImageMethodFor('profile', 'upload')}
                          className="w-full p-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FaUpload /> Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageMethodFor('profile', 'camera')}
                          className="w-full p-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FaCamera /> Take Photo
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {imageMethod.profile === 'upload' ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, 'profile')}
                    className="w-28 mt-2"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => openCameraFor('profile')}
                    className="w-28 mt-2 px-3 py-1 border border-gray-300 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-2"
                  >
                    <FaCamera /> Open Camera
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><FaUser /> Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><FaCalendarAlt /> Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min={1} max={120} required />
              </div>
              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><FaPhone /> Mobile</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" maxLength={10} required />
              </div>
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><FaVenusMars /> Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              {/* Package */}
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><FaWallet /> Package</label>
                <div className="flex gap-2">
                  {['1', '3', '6', '12'].map((pkg) => (
                    <label key={pkg} className="flex items-center gap-1">
                      <input type="radio" name="package" value={pkg} checked={formData.package === pkg} onChange={handleChange} className="accent-blue-500" />
                      {pkg}M
                    </label>
                  ))}
                </div>
              </div>
              {/* Cardio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><FaIdCard /> Cardio</label>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="cardio" value="with" checked={formData.cardio === 'with'} onChange={handleChange} className="accent-blue-500" />
                    With
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="cardio" value="without" checked={formData.cardio === 'without'} onChange={handleChange} className="accent-blue-500" />
                    Without
                  </label>
                </div>
              </div>
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><FaCalendarAlt /> Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              {/* Payment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><FaMoneyBill /> Payment</label>
                <select name="payment" value={formData.payment} onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
              {/* Package Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><FaRupeeSign /> Package Amount</label>
                <input type="number" name="package_amount" value={formData.package_amount} onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              {/* Amount Paid */}
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><FaMoneyBill /> Amount Paid</label>
                <input type="number" name="transaction_paid" value={formData.transaction_paid} onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>

            {/* --- Aadhar Upload Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Aadhar Front */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700"><FaIdCard className="inline mr-1" /> Aadhar Front</label>
                <div className="relative">
                  <button type="button" onClick={() => toggleDropdown('aadharFront')}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400">
                    <span className="flex items-center gap-2">
                      {imageMethod.aadharFront === 'upload' ? <FaUpload /> : <FaCamera />}
                      {imageMethod.aadharFront === 'upload' ? 'Upload File' : 'Take Photo'}
                    </span>
                    <FaChevronDown className={`transition-transform ${showDropdown.aadharFront ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showDropdown.aadharFront && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button type="button" onClick={() => setImageMethodFor('aadharFront', 'upload')}
                          className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"><FaUpload /> Upload File</button>
                        <button type="button" onClick={() => setImageMethodFor('aadharFront', 'camera')}
                          className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"><FaCamera /> Take Photo</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {imageMethod.aadharFront === 'upload' ? (
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'aadharFront')}
                    className="w-full p-2 border border-gray-300 rounded-lg" />
                ) : (
                  <button type="button" onClick={() => openCameraFor('aadharFront')}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-2">
                    <FaCamera /> Open Camera
                  </button>
                )}
                {uploading.aadharFront && <Loader />}
                {aadharFrontPreview && <img src={aadharFrontPreview} alt="Aadhar Front Preview" className="w-full h-32 object-cover rounded-lg border" />}
              </div>
              {/* Aadhar Back */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700"><FaIdCard className="inline mr-1" /> Aadhar Back</label>
                <div className="relative">
                  <button type="button" onClick={() => toggleDropdown('aadharBack')}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400">
                    <span className="flex items-center gap-2">
                      {imageMethod.aadharBack === 'upload' ? <FaUpload /> : <FaCamera />}
                      {imageMethod.aadharBack === 'upload' ? 'Upload File' : 'Take Photo'}
                    </span>
                    <FaChevronDown className={`transition-transform ${showDropdown.aadharBack ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showDropdown.aadharBack && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button type="button" onClick={() => setImageMethodFor('aadharBack', 'upload')}
                          className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"><FaUpload /> Upload File</button>
                        <button type="button" onClick={() => setImageMethodFor('aadharBack', 'camera')}
                          className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"><FaCamera /> Take Photo</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {imageMethod.aadharBack === 'upload' ? (
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'aadharBack')}
                    className="w-full p-2 border border-gray-300 rounded-lg" />
                ) : (
                  <button type="button" onClick={() => openCameraFor('aadharBack')}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-2">
                    <FaCamera /> Open Camera
                  </button>
                )}
                {uploading.aadharBack && <Loader />}
                {aadharBackPreview && <img src={aadharBackPreview} alt="Aadhar Back Preview" className="w-full h-32 object-cover rounded-lg border" />}
              </div>
            </div>

            {/* Submit/Cancel */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
              <motion.button type="submit" variants={buttonVariants} whileHover="hover" whileTap="tap"
                className="w-full md:w-auto bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-all">
                Save Changes
              </motion.button>
              <motion.button type="button" onClick={handleClose} variants={buttonVariants} whileHover="hover" whileTap="tap"
                className="w-full md:w-auto bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-400 transition-all">
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditForm;