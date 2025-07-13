import axios from 'axios';
import logActivity from './ActivityLog';
 const updateTransaction = async (transaction_id,transaction_paid,package_amount,name) =>{


    const transaction_amount_due = package_amount - transaction_paid;

    try {
        const response = await axios.post('http://http://localhost:8081/transaction/updateTransactionMember', {
            transaction_id, // Send the transaction ID in the request body
            transaction_paid, // Send the new transaction paid amount
            package_amount,
            transaction_amount_due // Include the calculated due amount (optional, can be calculated on the server)
        });

        console.log('Transaction Updated Successfully:', response.status); // Handle successful response with data (if any)
        logActivity(localStorage.getItem('loginId') ,`transaction for  ${name} has been edited `)
    } catch (error) {
        console.error('Error Updating Transaction activity:', error); // Handle errors
    }
 

}

export default updateTransaction;