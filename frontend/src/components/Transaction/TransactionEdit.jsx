import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import logActivity from '../../globalFunction/ActivityLog';

const TransactionEdit = ({ transaction, handleClose }) => {
  const [amountPaid, setAmountPaid] = useState(transaction.transaction_amount_paid);
  const [amountDue, setAmountDue] = useState(transaction.transaction_amount_due);

  const handleAmountChange = (e) => {
    const paid = e.target.value;
    setAmountPaid(paid);
    setAmountDue(transaction.transaction_package_amount - paid);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:8081/transaction/updateTransaction/${transaction.transaction_id}`, {
      transaction_amount_paid: amountPaid,
      transaction_amount_due: amountDue
    })
      .then(res => {
        if (res.status === 200) {
          Swal.fire({
            title: "Success!",
            text: "Transaction has been updated.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            timerProgressBar: "True"
          });
          logActivity(localStorage.getItem('loginId'),`transaction Edited  with ID ${transaction.transaction_id} edit with amountpaid ${amountPaid}-- amountdue ${amountDue} `)
          handleClose();
          window.location.reload();
        } else {
          console.error('Update failed');
        }
      })
      .catch(err => {
        console.error('Error:', err);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white border rounded-lg px-8 py-5 mx-auto my-10 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Edit Transaction</h2>
        <form>
        <div className="mb-4">
            <label htmlFor="packageAmount" className="block text-gray-700 font-medium mb-2">packageAmount:</label>
            <input
              type="number"
              id="packageAmount"
              name="packageAmount"
              value={transaction.transaction_package_amount}
              readOnly
              className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amountPaid" className="block text-gray-700 font-medium mb-2">Amount Paid:</label>
            <input
              type="number"
              id="amountPaid"
              name="amountPaid"
              value={amountPaid}
              onChange={handleAmountChange}
              className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amountDue" className="block text-gray-700 font-medium mb-2">Amount Due:</label>
            <input
              type="number"
              id="amountDue"
              name="amountDue"
              value={amountDue}
              readOnly
              className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100"
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleEditSubmit}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="ml-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionEdit;

