import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logActivity from '../../globalFunction/ActivityLog';
import { FaUser, FaPhone, FaIdCard, FaTransgender, FaCalendarAlt, FaMoneyBill, FaRupeeSign } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from '../Loader/Loader';

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

  const navigate = useNavigate();

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

  const logTransaction = (memberId) => {
    const transactionData = {
      transaction_person_name: memberId,
      transaction_package_amount: packageAmount,
      transaction_amount_paid: Number(formData.amountPaid),
      transaction_amount_due: packageAmount - formData.amountPaid,
    };

    return axios.post('https://gym-royal-fitness.onrender.com/transaction/addTranscation', transactionData)
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
      axios.get(`https://gym-royal-fitness.onrender.com/package/getPackageAmount/${formData.package}`)
        .then(res => {
          if (res.status === 200) {
            const price = res.data.packagePrice;
            setPackageAmount(price);
            setFormData(prev => ({
              ...prev,
              packageAmount: price, // keep in sync
              amountPaid: prev.amountPaid || price // set default if empty
            }));
          }
        })
        .catch(err => console.error(err));
    }
  }, [formData.package]);

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
      const res = await axios.post('https://gym-royal-fitness.onrender.com/upload/image', formData, {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateAadhar(formData.aadhar)) {
      return;
    }

    axios.post('https://gym-royal-fitness.onrender.com/members/AddMember', {
      ...formData,
      profilePicUrl,
      aadharFrontUrl,
      aadharBackUrl
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
      .catch(err => console.log(err));
  };

  return (
    <motion.div
      className="bg-white border rounded-xl px-6 py-6 mx-auto my-8 max-w-md shadow-lg" // <-- Increased width and padding
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
        <FaUser className="text-blue-500" /> Add Member
      </h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3 flex items-center gap-2">
          <FaUser className="text-gray-400" />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border border-gray-300 p-2 text-sm w-full rounded-lg focus:outline-none focus:border-blue-400"
            required
          />
        </div>
        <div className="mb-3 flex items-center gap-2">
          <FaIdCard className="text-gray-400" />
          <input
            type="text"
            id="aadhar"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleChange}
            placeholder="Aadhar Card Number"
            className={`border p-2 text-sm w-full rounded-lg focus:outline-none focus:border-blue-400 ${aadharError ? 'border-red-500' : 'border-gray-300'}`}
            required
            maxLength={12}
            minLength={12}
            inputMode="numeric"
          />
        </div>
        {aadharError && <div className="text-red-500 text-xs mb-2">{aadharError}</div>}
        <div className="mb-3 flex items-center gap-2">
          <FaPhone className="text-gray-400" />
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile"
            className="border border-gray-300 p-2 text-sm w-full rounded-lg focus:outline-none focus:border-blue-400"
            required
          />
        </div>
        <div className="mb-3 flex items-center gap-2">
          <FaTransgender className="text-gray-400" />
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border border-gray-300 p-2 text-sm w-full rounded-lg focus:outline-none focus:border-blue-400"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <FaUser className="text-gray-400" />
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className="border border-gray-300 p-2 text-sm w-full rounded-lg focus:outline-none focus:border-blue-400"
            required
          />
        </div>
        <div className="mb-3 flex items-center gap-2">
          <FaMoneyBill className="text-gray-400" />
          <select
            id="payment"
            name="payment"
            value={formData.payment}
            onChange={handleChange}
            className="border border-gray-300 p-2 text-sm w-full rounded-lg focus:outline-none focus:border-blue-400"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <FaCalendarAlt className="text-gray-400" />
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="border border-gray-300 p-2 text-sm w-full rounded-lg focus:outline-none focus:border-blue-400"
            required
          />
        </div>
        <div className="mb-3 flex items-center gap-2">
          <FaRupeeSign className="text-gray-400" />
          <input
            type="number"
            id="packageAmount"
            name="packageAmount"
            value={formData.packageAmount || ''}
            readOnly
            placeholder="Package Amount"
            className="border border-gray-300 p-2 text-sm w-full rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100"
          />
        </div>
        <div className="mb-3 flex items-center gap-2">
          <FaRupeeSign className="text-gray-400" />
          <input
            type="number"
            id="amountPaid"
            name="amountPaid"
            value={formData.amountPaid || ''}
            onChange={handleChange}
            placeholder="Amount Paid"
            className="border border-gray-300 p-2 text-sm w-full rounded-lg focus:outline-none focus:border-blue-400"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-2 text-xs">Package:</label>
          <div className="flex flex-wrap -mx-2">
            <div className="px-2 w-1/4">
              <label htmlFor="color-red" className="block text-gray-700 font-medium mb-2 text-xs">
                <input
                  type="radio"
                  id="color-red"
                  name="package"
                  value="1"
                  checked={formData.package === '1'}
                  onChange={handleChange}
                  className="mr-2"
                />
                1 Month
              </label>
            </div>
            <div className="px-2 w-1/4">
              <label htmlFor="color-blue" className="block text-gray-700 font-medium mb-2 text-xs">
                <input
                  type="radio"
                  id="color-blue"
                  name="package"
                  value="3"
                  checked={formData.package === '3'}
                  onChange={handleChange}
                  className="mr-2"
                />
                3 Months
              </label>
            </div>
            <div className="px-2 w-1/4">
              <label htmlFor="color-green" className="block text-gray-700 font-medium mb-2 text-xs">
                <input
                  type="radio"
                  id="color-green"
                  name="package"
                  value="6"
                  checked={formData.package === '6'}
                  onChange={handleChange}
                  className="mr-2"
                />
                6 Months
              </label>
            </div>
            <div className="px-2 w-1/4">
              <label htmlFor="color-green" className="block text-gray-700 font-medium mb-2 text-xs">
                <input
                  type="radio"
                  id="color-green"
                  name="package"
                  value="12"
                  checked={formData.package === '12'}
                  onChange={handleChange}
                  className="mr-2"
                />
                12 Months
              </label>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => handleFileUpload(e, 'profile')}
            className="mb-2"
          />
          {profilePicPreview && (
            <img src={profilePicPreview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border" />
          )}
          {uploadingProfile && <Loader />}
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">Aadhar Front Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => handleFileUpload(e, 'aadharFront')}
            className="mb-2"
          />
          {aadharFrontPreview && (
            <img src={aadharFrontPreview} alt="Aadhar Front Preview" className="w-24 h-24 object-cover border" />
          )}
          {uploadingAadharFront && <Loader />}
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">Aadhar Back Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => handleFileUpload(e, 'aadharBack')}
            className="mb-2"
          />
          {aadharBackPreview && (
            <img src={aadharBackPreview} alt="Aadhar Back Preview" className="w-24 h-24 object-cover border" />
          )}
          {uploadingAadharBack && <Loader />}
        </div>
        <div className="py-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="bg-blue-500 text-white px-8 py-2 rounded-full hover:bg-blue-600 transition-all font-semibold text-sm"
          >
            Submit
          </motion.button>
        </div>
      </form>

    </motion.div>
  );
};

export default MemberForm;