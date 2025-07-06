import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import logActivity from '../../globalFunction/ActivityLog';
import { FaEdit, FaRupeeSign, FaBoxOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FeeStructure = () => {
  const [packageData, setPackageData] = useState([]);
  const [editAmount, setEditAmount] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/package/getPackage')
      .then(res => {
        if (res.status === 200) {
          // Sort by packageId ascending
          const sorted = [...res.data].sort((a, b) => a.packageId - b.packageId);
          setPackageData(sorted);
        } else {
          console.log(res.data);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleAmountChange = (packageId, value) => {
    setEditAmount(prevState => ({
      ...prevState,
      [packageId]: value
    }));
  };

  const handleEditClick = (packageId, currentAmount) => {
    setEditingId(packageId);
    setEditAmount(prev => ({
      ...prev,
      [packageId]: currentAmount
    }));
  };

  const handleSave = (packageId) => {
    const amount = editAmount[packageId] !== undefined ? editAmount[packageId] : packageData.find(ele => ele.packageId === packageId).packagePrice;

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to update the amount!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post('http://localhost:8081/package/updateAmount', { packageId, amount })
          .then(res => {
            if (res.status === 200) {
              Swal.fire(
                'Updated!',
                'The package amount has been updated.',
                'success'
              );
              logActivity(localStorage.getItem('loginId'), `PackageID  ${packageId} has been edited with ${amount}`);
              setPackageData(prevData =>
                prevData.map(ele =>
                  ele.packageId === packageId ? { ...ele, packagePrice: amount } : ele
                )
              );
              setEditingId(null);
            }
          })
          .catch(err => console.log(err));
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          'The package amount is unchanged.',
          'error'
        );
        setEditingId(null);
      }
    });
  };

  return (
    <>
      <motion.div
        className='text-center text-xl py-4 px-4 mx-2 my-4 w-full bg-blue-500 rounded-lg shadow'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="flex items-center justify-center gap-2 text-white">
          <FaBoxOpen className="text-white" /> Fee Structure
        </h1>
      </motion.div>
      <motion.div
        className="flex items-center justify-center px-auto py-auto"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <table className="w-[90%] text-md bg-white shadow-md rounded mb-4">
          <tbody>
            <tr className="border-b bg-blue-100">
              <th className="text-center p-4 px-5">ID</th>
              <th className="text-center p-4 px-5">Package (Months)</th>
              <th className="text-center p-4 px-5">Amount</th>
              <th className="text-center p-4 px-5">Actions</th>
            </tr>
            {packageData.length > 0 ? packageData.map((ele) => (
              <motion.tr
                className="border-b hover:bg-orange-100 bg-gray-50"
                key={ele.packageId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <td className="p-4 px-5 text-center font-semibold">{ele.packageId}</td>
                <td className="p-4 px-5 text-center">{ele.packageMonth}</td>
                <td className="p-4 px-5 text-center flex items-center justify-center gap-2">
                  <FaRupeeSign className="text-green-600" />
                  {editingId === ele.packageId ? (
                    <input
                      type="number"
                      value={editAmount[ele.packageId]}
                      onChange={(e) => handleAmountChange(ele.packageId, e.target.value)}
                      className="border border-blue-400 p-2 w-24 rounded-lg focus:outline-none focus:border-blue-600 text-center"
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium">{ele.packagePrice}</span>
                  )}
                </td>
                <td className="p-3 px-5 text-center">
                  {editingId === ele.packageId ? (
                    <motion.button
                      type="button"
                      onClick={() => handleSave(ele.packageId)}
                      className="text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                      whileHover={{ scale: 1.08 }}
                    >
                      Save
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={() => handleEditClick(ele.packageId, ele.packagePrice)}
                      className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline flex items-center gap-1"
                      whileHover={{ scale: 1.08 }}
                    >
                      <FaEdit /> Edit
                    </motion.button>
                  )}
                </td>
              </motion.tr>
            )) : <tr><td colSpan="6" className='text-center'>Package not found</td></tr>}
          </tbody>
        </table>
      </motion.div>
    </>
  );
}

export default FeeStructure;
