import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import logActivity from '../../globalFunction/ActivityLog';
import updateTransaction from '../../globalFunction/Updatetans';
import { FaUser, FaPhone, FaVenusMars, FaCalendarAlt, FaMoneyBill, FaRupeeSign, FaWallet } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/api';
const EditForm = ({ member, handleClose }) => {


  const [packageAmount, setPackageAmount] = useState(member.transaction_package_amount)
  const [isRenewModalOpen, setRenewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: member.name,
    age: member.age,
    mobile: member.mobile,
    gender: member.gender,
    package: member.package,
    startDate: member.startDate,
    payment: member.paymentMethod,
    package_amount: member.transaction_package_amount,
    transaction_id: member.transaction_id,
    transaction_paid: member.transaction_amount_paid
  });
  ;
  const oldMemberName = member.name;


  useEffect(() => {
    if (formData.package) {
      api.get(`/package/getPackageAmount/${formData.package}`)
        .then(res => {
          if (res.status === 200 && res.data && res.data.packagePrice !== undefined) {
            setPackageAmount(res.data.packagePrice);
            setFormData(prev => ({ ...prev, package_amount: res.data.packagePrice }));
          }
        })
        .catch(err => console.error(err));
    }
  }, [formData.package]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
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
      });
  };

  const logTransaction = (memberId, packageAmount, amountPaid) => {
    const transactionData = {
      transaction_person_name: memberId,
      transaction_package_amount: Number(packageAmount),
      transaction_amount_paid: Number(amountPaid),
      transaction_amount_due: Number(packageAmount) - Number(amountPaid),
    };

    return api.post('/transaction/addTranscation', transactionData)
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


  const handleRenew = () =>{
    setRenewModalOpen(true); // Open the renewal modal
  }


  // Add a simple RenewModal component inside EditMember for clarity
  const RenewModal = () => {
    // Local state for package price and amount paid in the renew modal
    const [renewPackagePrice, setRenewPackagePrice] = useState(packageAmount);
    const [renewAmountPaid, setRenewAmountPaid] = useState(formData.transaction_paid);

    // Fetch package price when package changes in the renew modal
    useEffect(() => {
      if (formData.package) {
        api.get(`/package/getPackageAmount/${formData.package}`)
          .then(res => {
            if (res.status === 200 && res.data && res.data.packagePrice !== undefined) {
              setRenewPackagePrice(res.data.packagePrice);
              // Optionally set amount paid to package price by default
              setRenewAmountPaid(res.data.packagePrice);
            }
          })
          .catch(err => console.error(err));
      }
    }, []);

    // Handle amount paid change
    const handleRenewAmountPaidChange = (e) => {
      setRenewAmountPaid(e.target.value);
    };

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
            className="bg-white border rounded-2xl px-8 py-7 mx-auto my-10 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-xl font-bold mb-4 text-center text-blue-700 flex items-center justify-center gap-2">
              <FaUser className="text-blue-500" /> Renew Membership
            </h2>
            <form onSubmit={e => {
              e.preventDefault();
              api.post(
                `/members/renewMember/${member.id}`,
                {
                  package: formData.package,
                  startDate: formData.startDate,
                  paymentMethod: formData.payment,
                }
              )
              .then(async (res) => {
                if (res.status === 200) {
                  // Pass the correct values to logTransaction
                  const transactionLogged = await logTransaction(
                    res.data.memberId,
                    renewPackagePrice,
                    renewAmountPaid
                  );
                  if (transactionLogged) {
                    Swal.fire({
                      title: 'Success!',
                      text: 'Member has been renewed.',
                      icon: 'success',
                      timer: 1500,
                      showConfirmButton: false,
                      timerProgressBar: 'True',
                    });
                    setRenewModalOpen(false);
                    handleClose();
                  }
                }
              })
              .catch((err) => {
                console.error('Error:', err);
              });
            }}>
              {/* Package selection */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                  <FaWallet /> Package
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["1", "3", "6", "12"].map((pkg) => (
                    <label key={pkg} className="flex items-center text-gray-700 font-medium">
                      <input
                        type="radio"
                        name="package"
                        value={pkg}
                        checked={formData.package === pkg}
                        onChange={handleChange}
                        className="mr-2 accent-blue-500"
                      />
                      {pkg} Month{pkg !== "1" && "s"}
                    </label>
                  ))}
                </div>
              </div>
              {/* Package Price */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                  <FaRupeeSign /> Package Price
                </label>
                <input
                  type="number"
                  value={renewPackagePrice || ''}
                  readOnly
                  className="border border-gray-300 p-2 w-full rounded-lg bg-gray-100 focus:outline-none focus:border-blue-400"
                />
              </div>
              {/* Amount Paid */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                  <FaMoneyBill /> Amount Paid
                </label>
                <input
                  type="number"
                  value={renewAmountPaid || ''}
                  onChange={handleRenewAmountPaidChange}
                  className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
              {/* Start Date */}
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
              {/* Payment */}
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
              <div className="flex justify-center mt-6 gap-3">
                <motion.button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  Renew
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setRenewModalOpen(false)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

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
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white border rounded-2xl px-8 py-7 mx-auto my-10 max-w-2xl w-full shadow-2xl"
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

                  {/* Package Radio Buttons */}
                  <div className="mb-2 col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                      <FaWallet /> Package
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["1", "3", "6", "12"].map((pkg) => (
                        <label key={pkg} className="flex items-center text-gray-700 font-medium">
                          <input
                            type="radio"
                            name="package"
                            value={pkg}
                            checked={formData.package === pkg}
                            onChange={handleChange}
                            className="mr-2 accent-blue-500"
                          />
                          {pkg} Month{pkg !== "1" && "s"}
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
                      value={packageAmount}
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
      {isRenewModalOpen && <RenewModal />}
    </>
  );
}

export default EditForm;