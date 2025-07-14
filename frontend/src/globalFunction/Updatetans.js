import axios from 'axios';
import logActivity from './ActivityLog';
 const updateTransaction = async (transaction_id,transaction_paid,package_amount,name) =>{


    const transaction_amount_due = package_amount - transaction_paid;

    try {
        const payload = {
            transaction_id, // Send the transaction ID in the request body
            transaction_paid: Number(transaction_paid), // Ensure number
            package_amount: Number(package_amount),
            transaction_amount_due: Number(package_amount) - Number(transaction_paid)
        };
        console.log('Sending transaction update payload:', payload);
        const response = await axios.post('http://localhost:8081/transaction/updateTransactionMember', payload);

        console.log('Transaction Updated Successfully:', response.status); // Handle successful response with data (if any)
        logActivity(localStorage.getItem('loginId') ,`transaction for  ${name} has been edited `)
    } catch (error) {
        console.error('Error Updating Transaction activity:', error); // Handle errors
    }
 

}

export default updateTransaction;