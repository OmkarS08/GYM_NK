const db = require('../config/firebaseConfig');

// Add a new transaction
const addTransaction = async (req, res) => {
    const { transaction_person_name, transaction_package_amount, transaction_amount_paid, transaction_amount_due } = req.body;
    try {
        await db.collection('transaction').add({
            transaction_person_name,
            transaction_package_amount,
            transaction_amount_paid,
            transaction_amount_due,
            transaction_time_stamp: new Date()
        });
        return res.json("Success");
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
};

// Get all transactions with member info
const getTransaction = async (req, res) => {
    try {
        const transSnap = await db.collection('transaction').orderBy('transaction_time_stamp', 'desc').get();
        const memberSnap = await db.collection('gymMembers').get();
        const members = {};
        memberSnap.docs.forEach(doc => {
            members[doc.id] = doc.data();
        });

        const transactions = transSnap.docs.map(doc => {
            const t = doc.data();
            const member = members[t.transaction_person_name] || {};
            return {
                transaction_id: doc.id,
                transaction_person_name: t.transaction_person_name,
                transaction_package_amount: t.transaction_package_amount,
                transaction_amount_paid: t.transaction_amount_paid,
                transaction_amount_due: t.transaction_amount_due,
                transaction_time_stamp: t.transaction_time_stamp?.toDate ? t.transaction_time_stamp.toDate().toISOString().slice(0, 19).replace('T', ' ') : '',
                member_name: member.name || '',
                member_package: member.package || '',
                endDate: member.endDate || ''
            };
        });
        return res.json(transactions);
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
};

// Get transaction totals
const getCountTrans = async (req, res) => {
    try {
        const transSnap = await db.collection('transaction').get();
        let total_amount_paid = 0;
        let total_amount_due = 0;
        let total_package_amount = 0;

        transSnap.docs.forEach(doc => {
            const t = doc.data();
            total_amount_paid += Number(t.transaction_amount_paid) || 0;
            total_amount_due += Number(t.transaction_amount_due) || 0;
            total_package_amount += Number(t.transaction_package_amount) || 0;
        });

        return res.json([{
            total_amount_paid,
            total_amount_due,
            total_package_amount
        }]);
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
};

// Update transaction by id
const updateTransaction = async (req, res) => {
    const id = req.params.id;
    const { transaction_amount_paid, transaction_amount_due } = req.body;
    try {
        await db.collection('transaction').doc(id).update({
            transaction_amount_paid,
            transaction_amount_due
        });
        return res.json("Success");
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
};

// Update transaction by transaction_id (from body)
const updateTransactionMember = async (req, res) => {
    const { transaction_id, transaction_paid, package_amount, transaction_amount_due } = req.body;
    try {
        await db.collection('transaction').doc(transaction_id).update({
            transaction_amount_paid: transaction_paid,
            transaction_amount_due,
            transaction_package_amount: package_amount
        });
        return res.json("Success");
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
};

// Delete transaction by id
const deleteTransaction = async (req, res) => {
    const id = req.params.id;
    try {
        await db.collection('transaction').doc(id).delete();
        return res.json("Success");
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
};

module.exports = { 
  addTransaction, 
  getTransaction, 
  getCountTrans, 
  updateTransaction, 
  updateTransactionMember,
  deleteTransaction
};

