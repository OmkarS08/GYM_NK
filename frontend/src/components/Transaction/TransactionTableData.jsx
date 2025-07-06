import React, { useState } from 'react';
import TransactionEdit from './TransactionEdit';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2'; // <-- Import SweetAlert2

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

const TransactionTableData = ({ data: initialData, onDelete }) => {
  const [data, setData] = useState(initialData); // Use local state for transactions
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, transaction: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEditClick = (transaction) => setSelectedTransaction(transaction);

  const handleDeleteClick = (transaction) =>
    setDeleteDialog({ open: true, transaction });

  const handleCloseEdit = () => setSelectedTransaction(null);

  const handleCloseDelete = () =>
    setDeleteDialog({ open: false, transaction: null });

  const handleConfirmDelete = async (password) => {
    setDeleteLoading(true);
    try {
      // Get admin email (replace with your actual logic)
      const adminEmail = localStorage.getItem('adminEmail'); // or from context/props

      // 1. Verify password
      const verifyRes = await axios.post('http://localhost:8081/auth/verifyPassword', {
        email: adminEmail,
        password
      });

      if (verifyRes.status !== 200) {
        throw new Error('Password verification failed');
      }

      // 2. Delete transaction if password is correct
      const transaction_id = deleteDialog.transaction.transaction_id;
      await axios.delete(`http://localhost:8081/transaction/deleteTransaction/${transaction_id}`);

      setData(prev => prev.filter(t => t.transaction_id !== transaction_id));
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
      if (onDelete) {
        await onDelete(transaction_id, password);
      }
    } catch (err) {
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
      <AnimatePresence>
        {data.map((ele, index) => (
          <motion.tr
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="hover:bg-gray-50 transition"
          >
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{ele.member_name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{ele.member_package} months</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{ele.endDate}</td>
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
