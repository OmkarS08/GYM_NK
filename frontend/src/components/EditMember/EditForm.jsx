import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import logActivity from '../../globalFunction/ActivityLog';
import updateTransaction from '../../globalFunction/Updatetans';
import { FaUser, FaPhone, FaVenusMars, FaCalendarAlt, FaMoneyBill, FaRupeeSign, FaWallet, FaIdCard, FaHeart, FaImage, FaCamera, FaUpload, FaChevronDown } from 'react-icons/fa';
import Loader from '../Loader/Loader';
import { useWebcam } from '../../context/WebcamContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/api';
import RenewModal from './RenewModal';
const EditForm = ({ member, handleClose }) => {


  // Get the latest transaction (if any)
  const latestTransaction = Array.isArray(member.transactions) && member.transactions.length > 0
    ? member.transactions[0]
    : null;

  const [packageAmount, setPackageAmount] = useState(
    latestTransaction ? latestTransaction.transaction_package_amount : ''
  );
  const [isRenewModalOpen, setRenewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(member);
  const [formData, setFormData] = useState({
    name: member.name,
    age: member.age,
    mobile: member.mobile,
    gender: member.gender,
    package: member.package, // this will select the correct radio
    startDate: member.startDate,
    payment: member.paymentMethod,
    package_amount: latestTransaction ? latestTransaction.transaction_package_amount : '',
    transaction_id: latestTransaction ? latestTransaction.id : '',
    transaction_paid: latestTransaction ? latestTransaction.transaction_amount_paid : '',
    cardio: member.cardio || 'with',
    aadhar: member.aadhar || '',
    profilePicUrl: member.profilePicUrl || '',
    aadharFrontUrl: member.aadharFrontUrl || '',
    aadharBackUrl: member.aadharBackUrl || ''
  });
  const [aadharError, setAadharError] = useState('');
  const oldMemberName = member.name;
  const [profilePicPreview, setProfilePicPreview] = useState(member.profilePicUrl || '');
  const [aadharFrontPreview, setAadharFrontPreview] = useState(member.aadharFrontUrl || '');
  const [aadharBackPreview, setAadharBackPreview] = useState(member.aadharBackUrl || '');
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingAadharFront, setUploadingAadharFront] = useState(false);
  const [uploadingAadharBack, setUploadingAadharBack] = useState(false);
  const [imageMethod, setImageMethod] = useState({
    profile: 'upload',
    aadharFront: 'upload',
    aadharBack: 'upload'
  });
  const [showDropdown, setShowDropdown] = useState({
    profile: false,
    aadharFront: false,
    aadharBack: false
  });
  const { openWebcamModal } = useWebcam();


  useEffect(() => {
    if (formData.package) {
      api.get(`/package/getPackageAmount/${formData.package}`)
        .then(res => {
          if (res.status === 200) {
            const price = formData.cardio === 'with'
              ? res.data.packagePriceWithCardio
              : res.data.packagePriceWithoutCardio;
            setPackageAmount(price);
            setFormData(prev => ({
              ...prev,
              package_amount: price // Only update package_amount, not transaction_paid
            }));
          }
        })
        .catch(err => console.error(err));
    }
  }, [formData.package, formData.cardio]);

  // Upload logic (from MemberForm)
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'profile') setProfilePicPreview(reader.result);
      else if (type === 'aadharFront') setAadharFrontPreview(reader.result);
      else if (type === 'aadharBack') setAadharBackPreview(reader.result);
    };
    reader.readAsDataURL(file);
    if (type === 'profile') setUploadingProfile(true);
    else if (type === 'aadharFront') setUploadingAadharFront(true);
    else if (type === 'aadharBack') setUploadingAadharBack(true);
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
      const res = await api.post('/upload/image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (type === 'profile') setFormData(prev => ({ ...prev, profilePicUrl: res.data.url }));
      else if (type === 'aadharFront') setFormData(prev => ({ ...prev, aadharFrontUrl: res.data.url }));
      else if (type === 'aadharBack') setFormData(prev => ({ ...prev, aadharBackUrl: res.data.url }));
    } catch (err) {
      alert('Image upload failed');
    } finally {
      if (type === 'profile') setUploadingProfile(false);
      else if (type === 'aadharFront') setUploadingAadharFront(false);
      else if (type === 'aadharBack') setUploadingAadharBack(false);
    }
  };
  const handleWebcamCapture = async (img, type) => {
    if (type === 'profile') setProfilePicPreview(img);
    else if (type === 'aadharFront') setAadharFrontPreview(img);
    else if (type === 'aadharBack') setAadharBackPreview(img);
    if (type === 'profile') setUploadingProfile(true);
    else if (type === 'aadharFront') setUploadingAadharFront(true);
    else if (type === 'aadharBack') setUploadingAadharBack(true);
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
      const uploadRes = await api.post('/upload/image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (type === 'profile') setFormData(prev => ({ ...prev, profilePicUrl: uploadRes.data.url }));
      else if (type === 'aadharFront') setFormData(prev => ({ ...prev, aadharFrontUrl: uploadRes.data.url }));
      else if (type === 'aadharBack') setFormData(prev => ({ ...prev, aadharBackUrl: uploadRes.data.url }));
    } catch (err) {
      alert('Image upload failed');
    } finally {
      if (type === 'profile') setUploadingProfile(false);
      else if (type === 'aadharFront') setUploadingAadharFront(false);
      else if (type === 'aadharBack') setUploadingAadharBack(false);
    }
  };
  const openCameraFor = (type) => {
    openWebcamModal(type, (img) => handleWebcamCapture(img, type));
  };
  const toggleDropdown = (type) => {
    setShowDropdown(prev => ({ ...prev, [type]: !prev[type] }));
  };
  const setImageMethodFor = (type, method) => {
    setImageMethod(prev => ({ ...prev, [type]: method }));
    setShowDropdown(prev => ({ ...prev, [type]: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'package_amount' || name === 'transaction_paid') {
      val = value === '' ? '' : Number(value);
    }
    if (name === 'aadhar') {
      if (!/^\d{0,12}$/.test(value)) return;
      if (value.length === 12 && !/^\d{12}$/.test(value)) {
        setAadharError('Aadhar must be a 12-digit number');
      } else {
        setAadharError('');
      }
    }
    setFormData({ ...formData, [name]: val });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (formData.aadhar.length !== 12) {
      setAadharError('Aadhar must be a 12-digit number');
      return;
    }
    setLoading(true);
    api.post(`/members/updateMember/${member.id}`, formData)
      .then(res => {
        if (res.status === 200) {
          Swal.fire({
            title: "Success!",
            text: "Member information has been updated.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            timerProgressBar: "True"
          });
          handleClose(); // Close the modal after successful update

          const { transaction_id, transaction_paid, package_amount, name } = formData;
          updateTransaction(transaction_id, transaction_paid, package_amount, name)

          const myreload = () => {
            window.location.reload()
          }
          setTimeout(myreload, 1600)

          logActivity(localStorage.getItem('loginId'), `Member with name id ${oldMemberName === formData.name ? oldMemberName : formData.name} has been edited`)
        } else {
          console.log('Update failed');
        }
      })
      .catch(err => {
        console.error('Error:', err);
      })
      .finally(() => setLoading(false));
  };

  // const logTransaction = (memberId, packageAmount, amountPaid) => {
  //   const transactionData = {
  //     transaction_person_name: memberId,
  //     transaction_package_amount: Number(packageAmount),
  //     transaction_amount_paid: Number(amountPaid),
  //     transaction_amount_due: Number(packageAmount) - Number(amountPaid),
  //   };
  //
  //   return api.post('/transaction/addTranscation', transactionData)
  //     .then(res => {
  //       if (res.status === 200) {
  //         console.log('Transaction logged successfully');
  //         return true;
  //       } else {
  //         console.log('Transaction didn\'t log');
  //         return false;
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       return false;
  //     });
  // };


  const handleRenew = () =>{
    setRenewModalOpen(true); // Open the renewal modal
  }


  return (
    <>
      <AnimatePresence>
        {!isRenewModalOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white border rounded-2xl px-8 py-7 mx-auto my-10 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 flex items-center justify-center gap-2">
                <FaUser className="text-blue-500" /> Edit Member
              </h2>
              <form>
                <div className="grid grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="mb-4 col-span-2">
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaUser /> Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>

                  {/* Age Input */}
                  <div className="mb-4">
                    <label htmlFor="age" className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaCalendarAlt /> Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={e => {
                        if (e.target.value === "" || (Number(e.target.value) <= 100 && Number(e.target.value) > 0)) {
                          handleChange(e);
                        }
                      }}
                      min={1}
                      max={100}
                      className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>

                  {/* Mobile Input */}
                  <div className="mb-4">
                    <label htmlFor="mobile" className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaPhone /> Mobile
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={e => {
                        if (/^\d{0,10}$/.test(e.target.value)) handleChange(e);
                      }}
                      pattern="\d{10}"
                      maxLength={10}
                      minLength={10}
                      className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                      required
                      placeholder="10 digit mobile number"
                    />
                  </div>

                  {/* Gender Dropdown */}
                  <div className="mb-4">
                    <label htmlFor="gender" className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaVenusMars /> Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  {/* Aadhar */}
                  <div className="mb-4 col-span-2">
                    <label htmlFor="aadhar" className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaIdCard /> Aadhar Card Number
                    </label>
                    <input
                      type="text"
                      id="aadhar"
                      name="aadhar"
                      value={formData.aadhar || ''}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                      placeholder="Enter 12-digit Aadhar number"
                      maxLength={12}
                      minLength={12}
                      required
                    />
                    {aadharError && (
                      <p className="text-red-500 text-sm mt-1">{aadharError}</p>
                    )}
                  </div>

                  {/* Profile Photo Upload */}
                  <div className="mb-4 col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaImage /> Profile Photo
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleDropdown('profile')}
                        className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          {imageMethod.profile === 'upload' ? <FaUpload /> : <FaCamera />}
                          {imageMethod.profile === 'upload' ? 'Upload File' : 'Take Photo'}
                        </span>
                        <FaChevronDown className={`transition-transform ${showDropdown.profile ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showDropdown.profile && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                          >
                            <button
                              type="button"
                              onClick={() => setImageMethodFor('profile', 'upload')}
                              className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FaUpload /> Upload File
                            </button>
                            <button
                              type="button"
                              onClick={() => setImageMethodFor('profile', 'camera')}
                              className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
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
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => openCameraFor('profile')}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                      >
                        <FaCamera /> Open Camera
                      </button>
                    )}
                    {uploadingProfile && <Loader />}
                    {profilePicPreview && (
                      <img src={profilePicPreview} alt="Profile Preview" className="w-full h-32 object-cover rounded-lg border mt-2" />
                    )}
                  </div>
                  {/* Aadhar Front Upload */}
                  <div className="mb-4 col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaImage /> Aadhar Front
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleDropdown('aadharFront')}
                        className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          {imageMethod.aadharFront === 'upload' ? <FaUpload /> : <FaCamera />}
                          {imageMethod.aadharFront === 'upload' ? 'Upload File' : 'Take Photo'}
                        </span>
                        <FaChevronDown className={`transition-transform ${showDropdown.aadharFront ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showDropdown.aadharFront && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                          >
                            <button
                              type="button"
                              onClick={() => setImageMethodFor('aadharFront', 'upload')}
                              className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FaUpload /> Upload File
                            </button>
                            <button
                              type="button"
                              onClick={() => setImageMethodFor('aadharFront', 'camera')}
                              className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FaCamera /> Take Photo
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {imageMethod.aadharFront === 'upload' ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'aadharFront')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => openCameraFor('aadharFront')}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                      >
                        <FaCamera /> Open Camera
                      </button>
                    )}
                    {uploadingAadharFront && <Loader />}
                    {aadharFrontPreview && (
                      <img src={aadharFrontPreview} alt="Aadhar Front Preview" className="w-full h-32 object-cover rounded-lg border mt-2" />
                    )}
                  </div>
                  {/* Aadhar Back Upload */}
                  <div className="mb-4 col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaImage /> Aadhar Back
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleDropdown('aadharBack')}
                        className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          {imageMethod.aadharBack === 'upload' ? <FaUpload /> : <FaCamera />}
                          {imageMethod.aadharBack === 'upload' ? 'Upload File' : 'Take Photo'}
                        </span>
                        <FaChevronDown className={`transition-transform ${showDropdown.aadharBack ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showDropdown.aadharBack && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                          >
                            <button
                              type="button"
                              onClick={() => setImageMethodFor('aadharBack', 'upload')}
                              className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FaUpload /> Upload File
                            </button>
                            <button
                              type="button"
                              onClick={() => setImageMethodFor('aadharBack', 'camera')}
                              className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FaCamera /> Take Photo
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {imageMethod.aadharBack === 'upload' ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'aadharBack')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => openCameraFor('aadharBack')}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                      >
                        <FaCamera /> Open Camera
                      </button>
                    )}
                    {uploadingAadharBack && <Loader />}
                    {aadharBackPreview && (
                      <img src={aadharBackPreview} alt="Aadhar Back Preview" className="w-full h-32 object-cover rounded-lg border mt-2" />
                    )}
                  </div>

                  {/* Cardio Option */}
                  <div className="mb-4 col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaHeart /> Cardio Option
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="relative">
                        <input
                          type="radio"
                          name="cardio"
                          value="with"
                          checked={formData.cardio === 'with'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.cardio === 'with'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="font-semibold">With Cardio</div>
                          <div className="text-sm text-gray-600">Includes cardio equipment access</div>
                        </div>
                      </label>
                      <label className="relative">
                        <input
                          type="radio"
                          name="cardio"
                          value="without"
                          checked={formData.cardio === 'without'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.cardio === 'without'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="font-semibold">Without Cardio</div>
                          <div className="text-sm text-gray-600">Basic gym equipment only</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Package Radio Buttons */}
                  <div className="mb-2 col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaWallet /> Package
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['1', '3', '6', '12'].map((pkg) => (
                        <label key={pkg} className="flex items-center text-gray-700 font-medium">
                          <input
                            type="radio"
                            name="package"
                            value={pkg}
                            checked={formData.package === pkg}
                            onChange={handleChange}
                            className="mr-2 accent-blue-500"
                          />
                          {pkg} Month{pkg !== '1' && 's'}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Start Date Input */}
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaCalendarAlt /> Start date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>

                  {/* Payment Dropdown */}
                  <div className="mb-4">
                    <label htmlFor="payment" className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaMoneyBill /> Payment
                    </label>
                    <select
                      id="payment"
                      name="payment"
                      value={formData.payment}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                      required
                    >
                      <option value="">Select Payment Method</option>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>

                  {/* Package Amount */}
                  <div className="mb-4">
                    <label htmlFor="package_amount" className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaRupeeSign /> Package Amount
                    </label>
                    <input
                      type="number"
                      id="package_amount"
                      name="package_amount"
                      value={formData.package_amount}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>

                  {/* Amount Paid */}
                  <div className="mb-4">
                    <label htmlFor="transaction_paid" className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaMoneyBill /> Amount Paid
                    </label>
                    <input
                      type="number"
                      id="transaction_paid"
                      name="transaction_paid"
                      value={formData.transaction_paid}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-6 gap-3">
                  <motion.button
                    type="button"
                    onClick={handleEditSubmit}
                    className={`bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    whileHover={loading ? {} : { scale: 1.05 }}
                    disabled={loading}
                  >
                    {loading ? <Loader size={20} color="#fff" /> : 'Save'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleRenew}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    Renew
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {isRenewModalOpen && <RenewModal 
        member={member}
        formData={formData}
        handleChange={handleChange}
        packageAmount={packageAmount}
        setRenewModalOpen={setRenewModalOpen}
        handleClose={handleClose}
      />}
    </>
  );
}

export default EditForm;