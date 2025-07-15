import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logActivity from '../../globalFunction/ActivityLog';
import { 
  FaUser, 
  FaPhone, 
  FaIdCard, 
  FaTransgender, 
  FaCalendarAlt, 
  FaMoneyBill, 
  FaRupeeSign,
  FaCamera,
  FaUpload,
  FaChevronDown,
  FaImage,
  FaCreditCard,
  FaDumbbell,
  FaHeart
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../Loader/Loader';
import api from '../../api/api';
import { useWebcam } from '../../context/WebcamContext';

const MemberForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    mobile: '',
    gender: '',
    package: '',
    startDate: '',
    payment: '',
    amountPaid: '',
    aadhar: ''
  });
  const [packageAmount, setPackageAmount] = useState(0);
  const [aadharError, setAadharError] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [aadharFrontUrl, setAadharFrontUrl] = useState('');
  const [aadharBackUrl, setAadharBackUrl] = useState('');
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [aadharFrontPreview, setAadharFrontPreview] = useState('');
  const [aadharBackPreview, setAadharBackPreview] = useState('');
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingAadharFront, setUploadingAadharFront] = useState(false);
  const [uploadingAadharBack, setUploadingAadharBack] = useState(false);
  const [cardio, setCardio] = useState('with');
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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { openWebcamModal } = useWebcam();

  // Validate Aadhar (12 digits)
  const validateAadhar = (value) => {
    if (!/^\d{12}$/.test(value)) {
      setAadharError('Aadhar must be a 12-digit number');
      return false;
    }
    setAadharError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'aadhar') {
      validateAadhar(value);
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  // Update logTransaction to include payment_method
  const logTransaction = (memberId) => {
    const transactionData = {
      transaction_person_name: memberId,
      transaction_package_amount: packageAmount,
      transaction_amount_paid: Number(formData.amountPaid),
      transaction_amount_due: packageAmount - formData.amountPaid,
      payment_method: formData.payment,
    };

    return api.post('/transaction/addTransaction', transactionData)
      .then(res => {
        if (res.status === 200) {
          console.log('Transaction logged successfully');
          return true;
        } else {
          console.log('Transaction didn\'t log');
          return false;
        }
      })
      .catch(err => {
        console.log(err);
        return false;
      });
  };

  useEffect(() => {
    if (formData.package) {
      api.get(`/package/getPackageAmount/${formData.package}`)
        .then(res => {
          if (res.status === 200) {
            const price = cardio === 'with'
              ? res.data.packagePriceWithCardio
              : res.data.packagePriceWithoutCardio;
            setPackageAmount(price);
            setFormData(prev => ({
              ...prev,
              packageAmount: price,
              amountPaid: prev.amountPaid || price
            }));
          }
        })
        .catch(err => console.error(err));
    }
  }, [formData.package, cardio]);

  // Handle file upload
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'profile') setProfilePicPreview(reader.result);
      else if (type === 'aadharFront') setAadharFrontPreview(reader.result);
      else if (type === 'aadharBack') setAadharBackPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Set loader
    if (type === 'profile') setUploadingProfile(true);
    else if (type === 'aadharFront') setUploadingAadharFront(true);
    else if (type === 'aadharBack') setUploadingAadharBack(true);

    // Upload to backend
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder',
      type === 'profile'
        ? 'gym_members/profile'
        : type === 'aadharFront'
        ? 'gym_members/aadhar/front'
        : 'gym_members/aadhar/back'
    );
    try {
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (type === 'profile') setProfilePicUrl(res.data.url);
      else if (type === 'aadharFront') setAadharFrontUrl(res.data.url);
      else if (type === 'aadharBack') setAadharBackUrl(res.data.url);
    } catch (err) {
      alert('Image upload failed');
    } finally {
      if (type === 'profile') setUploadingProfile(false);
      else if (type === 'aadharFront') setUploadingAadharFront(false);
      else if (type === 'aadharBack') setUploadingAadharBack(false);
    }
  };

  // Handle webcam capture
  const handleWebcamCapture = async (img, type) => {
    // Show preview immediately
    if (type === 'profile') setProfilePicPreview(img);
    else if (type === 'aadharFront') setAadharFrontPreview(img);
    else if (type === 'aadharBack') setAadharBackPreview(img);

    // Set loader
    if (type === 'profile') setUploadingProfile(true);
    else if (type === 'aadharFront') setUploadingAadharFront(true);
    else if (type === 'aadharBack') setUploadingAadharBack(true);

    // Convert base64 to Blob and upload
    const res = await fetch(img);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append('file', blob, `${type}.jpg`);
    formData.append('folder',
      type === 'profile'
        ? 'gym_members/profile'
        : type === 'aadharFront'
        ? 'gym_members/aadhar/front'
        : 'gym_members/aadhar/back'
    );
    try {
      const uploadRes = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (type === 'profile') setProfilePicUrl(uploadRes.data.url);
      else if (type === 'aadharFront') setAadharFrontUrl(uploadRes.data.url);
      else if (type === 'aadharBack') setAadharBackUrl(uploadRes.data.url);
    } catch (err) {
      alert('Image upload failed');
    } finally {
      if (type === 'profile') setUploadingProfile(false);
      else if (type === 'aadharFront') setUploadingAadharFront(false);
      else if (type === 'aadharBack') setUploadingAadharBack(false);
    }
  };

  // Open webcam modal for different types
  const openCameraFor = (type) => {
    openWebcamModal(type, (img) => handleWebcamCapture(img, type));
  };

  // Toggle dropdown for image method selection
  const toggleDropdown = (type) => {
    setShowDropdown(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Set image method
  const setImageMethodFor = (type, method) => {
    setImageMethod(prev => ({
      ...prev,
      [type]: method
    }));
    setShowDropdown(prev => ({
      ...prev,
      [type]: false
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateAadhar(formData.aadhar)) {
      return;
    }
    setLoading(true);
    api.post('/members/AddMember', {
      ...formData,
      profilePicUrl,
      aadharFrontUrl,
      aadharBackUrl,
      cardio: cardio
    })
      .then(async res => {
        if (res.data.message === "Success") {
          const transactionLogged = await logTransaction(res.data.memberId);

          if (transactionLogged) {
            localStorage.setItem('showSuccessAlert', 'true');
            navigate('/Members');
            logActivity(localStorage.getItem('loginId'), `New Member Added--> ${formData.name}`);
          } else {
            console.log('Transaction logging failed. Navigation aborted.');
          }
        } else {
          console.log(res);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const buttonVariants = {
    hover: { scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Add New Member
          </h1>
          <p className="text-gray-600 text-lg">
            Complete the form below to register a new gym member
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-500" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Age *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter age"
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender *
                  </label>
                  <div className="relative">
                    <FaTransgender className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Aadhar */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Aadhar Card Number *
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="aadhar"
                      value={formData.aadhar}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${aadharError ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter 12-digit Aadhar number"
                      maxLength={12}
                      minLength={12}
                      inputMode="numeric"
                      required
                    />
                  </div>
                  {aadharError && (
                    <p className="text-red-500 text-sm mt-1">{aadharError}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Membership Details Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCreditCard className="text-blue-500" />
                Membership Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date *
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method *
                  </label>
                  <div className="relative">
                    <FaMoneyBill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="payment"
                      value={formData.payment}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      required
                    >
                      <option value="">Select payment method</option>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Package Selection Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaDumbbell className="text-blue-500" />
                Package Selection
              </h2>
              
              {/* Package Duration */}
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Package Duration *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1, 3, 6, 12].map(month => (
                    <label key={month} className="relative">
                      <input
                        type="radio"
                        name="package"
                        value={month}
                        checked={formData.package === String(month)}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`p-4 border-2 rounded-lg text-center cursor-pointer transition-all ${
                        formData.package === String(month)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="font-semibold">{month}</div>
                        <div className="text-sm text-gray-600">
                          Month{month > 1 ? 's' : ''}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cardio Selection */}
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaHeart className="text-red-500" />
                  Cardio Option *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="relative">
                    <input
                      type="radio"
                      name="cardio"
                      value="with"
                      checked={cardio === 'with'}
                      onChange={() => setCardio('with')}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      cardio === 'with'
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
                      checked={cardio === 'without'}
                      onChange={() => setCardio('without')}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      cardio === 'without'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="font-semibold">Without Cardio</div>
                      <div className="text-sm text-gray-600">Basic gym equipment only</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Package Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Package Amount
                  </label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="packageAmount"
                      value={formData.packageAmount || ''}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount Paid *
                  </label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="amountPaid"
                      value={formData.amountPaid || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter amount paid"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Document Upload Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaImage className="text-blue-500" />
                Document Upload
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Photo */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Photo
                  </label>
                  
                  {/* Method Selector */}
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
                            <FaUpload />
                            Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageMethodFor('profile', 'camera')}
                            className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <FaCamera />
                            Take Photo
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Input based on method */}
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
                      <FaCamera />
                      Open Camera
                    </button>
                  )}

                  {/* Preview and Loader */}
                  {uploadingProfile && <Loader />}
                  {profilePicPreview && (
                    <img 
                      src={profilePicPreview} 
                      alt="Profile Preview" 
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  )}
                </div>

                {/* Aadhar Front */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Aadhar Front
                  </label>
                  
                  {/* Method Selector */}
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
                            <FaUpload />
                            Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageMethodFor('aadharFront', 'camera')}
                            className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <FaCamera />
                            Take Photo
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Input based on method */}
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
                      <FaCamera />
                      Open Camera
                    </button>
                  )}

                  {/* Preview and Loader */}
                  {uploadingAadharFront && <Loader />}
                  {aadharFrontPreview && (
                    <img 
                      src={aadharFrontPreview} 
                      alt="Aadhar Front Preview" 
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  )}
                </div>

                {/* Aadhar Back */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Aadhar Back
                  </label>
                  
                  {/* Method Selector */}
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
                            <FaUpload />
                            Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageMethodFor('aadharBack', 'camera')}
                            className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <FaCamera />
                            Take Photo
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Input based on method */}
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
                      <FaCamera />
                      Open Camera
                    </button>
                  )}

                  {/* Preview and Loader */}
                  {uploadingAadharBack && <Loader />}
                  {aadharBackPreview && (
                    <img 
                      src={aadharBackPreview} 
                      alt="Aadhar Back Preview" 
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              className="pt-6"
              variants={itemVariants}
            >
              <motion.button
                type="submit"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-700'}`}
                disabled={loading}
              >
                {loading ? <Loader size={24} color="#fff" /> : 'Add Member'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MemberForm;