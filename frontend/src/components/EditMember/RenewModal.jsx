import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaUser, FaRupeeSign, FaMoneyBill, FaCalendarAlt, FaWallet, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/api';
import Loader from '../Loader/Loader';

const RenewModal = ({ member, setRenewModalOpen, handleClose }) => {
 
  console.log(member);
  // Get the latest transaction (if any)
  const latestTransaction = Array.isArray(member.transactions) && member.transactions.length > 0
    ? member.transactions[0]
    : null;

  const [selectedPackage, setSelectedPackage] = useState(member.package || '1');
  const [cardio, setCardio] = useState(member.cardio || 'with');
  const [renewPackagePrice, setRenewPackagePrice] = useState(0);
  const [renewAmountPaid, setRenewAmountPaid] = useState(
    latestTransaction ? latestTransaction.transaction_amount_paid : ''
  );
  const [startDate, setStartDate] = useState(member.startDate || '');
  const [payment, setPayment] = useState(member.paymentMethod || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPackage) {
      api.get(`/package/getPackageAmount/${selectedPackage}`)
        .then(res => {
          if (res.status === 200) {
            const price = cardio === 'with'
              ? res.data.packagePriceWithCardio
              : res.data.packagePriceWithoutCardio;
            setRenewPackagePrice(price);
            setRenewAmountPaid(prev => (prev === '' || prev === price ? price : prev));
          }
        })
        .catch(err => console.error(err));
    }
  }, [selectedPackage, cardio]);

  const handleRenewAmountPaidChange = (e) => {
    setRenewAmountPaid(e.target.value);
  };
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handlePaymentChange = (e) => setPayment(e.target.value);

  const logTransaction = (memberId, packageAmount, amountPaid, paymentMethod) => {
    const transactionData = {
      transaction_person_name: memberId,
      transaction_package_amount: Number(packageAmount),
      transaction_amount_paid: Number(amountPaid),
      transaction_amount_due: Number(packageAmount) - Number(amountPaid),
      payment_method: paymentMethod // <-- ensure this is set
    };
    console.log(transactionData);
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
            if (loading) return;
            setLoading(true);
            api.post(
              `/members/renewMember/${member.id}`,
              {
                package: selectedPackage,
                startDate,
                paymentMethod: payment,
                cardio
              }
            )
            .then(async (res) => {
              console.log(res)
              if (res.status === 200) {
                const transactionLogged = await logTransaction(
                  res.data.member.id,
                  renewPackagePrice,
                  renewAmountPaid,
                  payment // <-- pass payment here
                );
                // Append renewal history
                const today = new Date();
                const renewalDate = today.toISOString().slice(0, 10);
                const packageName = selectedPackage === '0.5' ? '15-Days Plan' : `${selectedPackage}-Month Plan`;
                const amount = renewPackagePrice;
                const staff = localStorage.getItem('loginName') || '';
                const notes = '';
                // Use endDate from backend response if available, else calculate
                const endDate = res.data.member.endDate || '';
                await api.post(`/members/appendRenewalHistory/${member.id}`, {
                  renewalDate,
                  packageName,
                  amount,
                  startDate,
                  endDate,
                  paymentMethod: payment,
                  staff,
                  notes
                });
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
                  window.location.reload(); // <-- Add this line to refresh the page
                }
              }
            })
            .catch((err) => {
              console.error('Error:', err);
            })
            .finally(() => setLoading(false));
          }}>
            {/* Package selection */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                <FaWallet /> Package
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["0.5", "1", "3", "6"].map((pkg) => (
                  <label key={pkg} className="flex items-center text-gray-700 font-medium">
                    <input
                      type="radio"
                      name="package"
                      value={pkg}
                      checked={selectedPackage === pkg}
                      onChange={() => setSelectedPackage(pkg)}
                      className="mr-2 accent-blue-500"
                    />
                    {pkg === "0.5" ? "15 Days" : `${pkg} Month${pkg !== "1" ? "s" : ""}`}
                  </label>
                ))}
              </div>
            </div>
            {/* Cardio Option */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                <FaHeart className="text-red-500" /> Cardio Option
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
                value={startDate}
                onChange={handleStartDateChange}
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
                value={payment}
                onChange={handlePaymentChange}
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
                className={`bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-500'}`}
                whileHover={loading ? {} : { scale: 1.05 }}
                disabled={loading}
              >
                {loading ? <Loader size={20} color="#fff" /> : 'Renew'}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setRenewModalOpen(false)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                disabled={loading}
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

export default RenewModal;