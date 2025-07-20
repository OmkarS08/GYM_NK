import React, { useState } from 'react';
import TransactionEdit from './TransactionEdit';
import { FaEdit, FaTrash, FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { useMemberDialog } from '../../context/MemberDialogContext';
import Loader from '../Loader/Loader';
import  api from '../../api/api';
const DeleteDialog = ({ open, onClose, onConfirm, loading }) => {
  const [password, setPassword] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h2>
        <p className="mb-2 text-gray-600">Enter your password to delete this transaction:</p>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(password)}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            disabled={loading || !password}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const TransactionTableData = ({ data, onDelete }) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, transaction: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const { openDialog } = useMemberDialog();

  const handleEditClick = (transaction) => setSelectedTransaction(transaction);

  const handleDeleteClick = (transaction) =>
    setDeleteDialog({ open: true, transaction });

  const handleCloseEdit = () => setSelectedTransaction(null);

  const handleCloseDelete = () =>
    setDeleteDialog({ open: false, transaction: null });

  const handleNameClick = (transaction) => {
    openDialog({
      name: transaction.member_name,
      package: transaction.member_package,
      endDate: transaction.endDate,
      startDate1: transaction.startDate,
      ...transaction
    });
  };

  const handleConfirmDelete = async (password) => {
    setDeleteLoading(true);
    setShowLoader(true);
    try {
      const adminEmail = localStorage.getItem('adminEmail');
      const verifyRes = await api.post('http://localhost:8081/auth/verifyPassword', {
        email: adminEmail,
        password
      });

      if (verifyRes.status !== 200) {
        throw new Error('Password verification failed');
      }

      const transaction_id = deleteDialog.transaction.transaction_id;
      await api.delete(`http://localhost:8081/transaction/deleteTransaction/${transaction_id}`);

      // Instead of setData, call onDelete if provided
      if (onDelete) {
        await onDelete(transaction_id, password);
      }
      handleCloseDelete();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Transaction deleted successfully.',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      setTimeout(() => {
        setShowLoader(false);
        window.location.reload();
      }, 1600);
    } catch (err) {
      setShowLoader(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || err.message || 'Delete failed',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
    setDeleteLoading(false);
  };

  return (
    <>
      {showLoader && <Loader text="Deleting transaction..." />}
      <AnimatePresence>
        {data.map((ele, index) => (
          <motion.tr
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="hover:bg-gray-50 transition"
          >
            <td
              className="px-6 py-4 whitespace-nowrap font-medium text-blue-700 cursor-pointer hover:underline"
              onClick={() => handleNameClick(ele)}
            >
              {ele.member_name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{ele.member_package} months</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
              {ele.startDate ? new Date(ele.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{ele.endDate ? new Date(ele.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{ele.transaction_time_stamp}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{ele.transaction_package_amount}</td>
            <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">{ele.transaction_amount_paid}</td>
            <td className="px-6 py-4 whitespace-nowrap text-red-500 font-semibold">{ele.transaction_amount_due}</td>
            <td className="px-2 py-2 whitespace-nowrap flex gap-2">
              <button
                onClick={() => handleEditClick(ele)}
                className="p-2 rounded hover:bg-blue-100 text-blue-600 transition"
                title="Edit"
              >
                <FaEdit size={18} />
              </button>
              <button
                onClick={() => handleDeleteClick(ele)}
                className="p-2 rounded hover:bg-red-100 text-red-600 transition"
                title="Delete"
              >
                <FaTrash size={18} />
              </button>
            </td>
            {/* Payment Method Column */}
            <td className="px-6 py-4 whitespace-nowrap">
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`inline-flex items-center gap-1 font-semibold ${
                  ele.payment_method === 'UPI'
                    ? 'text-blue-600'
                    : 'text-green-600'
                }`}
              >
                {ele.payment_method === 'UPI' ? (
                  <>
                    <FaMobileAlt /> UPI
                  </>
                ) : (
                  <>
                    <FaMoneyBillWave /> Cash
                  </>
                )}
              </motion.span>
            </td>
          </motion.tr>
        ))}
      </AnimatePresence>
      {selectedTransaction && (
        <TransactionEdit
          transaction={selectedTransaction}
          handleClose={handleCloseEdit}
        />
      )}
      <DeleteDialog
        open={deleteDialog.open}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </>
  );
};

export default TransactionTableData;
