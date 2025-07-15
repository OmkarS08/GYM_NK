const db = require('../config/firebaseConfig');
const calculateEndDate = require('../utils/dateUtil');
const { format } = require('date-fns');
const admin = require('firebase-admin');

// Add a new member
const addMember = async (req, res) => {
    const { name, age, package: packageMonth, startDate, gender, mobile, payment, aadhar, profilePicUrl, aadharFrontUrl, aadharBackUrl, cardio } = req.body;
    try {
        const endDate = calculateEndDate(startDate, Number(packageMonth));
        const newMember = {
            name,
            age,
            gender,
            mobile,
            package: packageMonth,
            startDate,
            endDate,
            paymentMethod: payment,
            aadhar,
            profilePicUrl,   // <-- store profile photo URL
            aadharFrontUrl,
            aadharBackUrl,
            delete_flag: 0,
            createdAt: new Date(),
            cardio, // <-- save this
        };
        const docRef = await db.collection('gymMembers').add(newMember);
        return res.json({ message: "Success", memberId: docRef.id });
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
};

// Soft delete a member
const deleteMember = async (req, res) => {
    const id = req.params.id;
    try {
        await db.collection('gymMembers').doc(id).update({ delete_flag: 1 });
        return res.json("Success");
    } catch (err) {
        return res.status(500).json("Error");
    }
};

// Get all members (excluding deleted)
const getMember = async (req, res) => {
    try {
        // Fetch all members
        const snapshot = await db.collection('gymMembers').where('delete_flag', '!=', 1).orderBy('createdAt', 'desc').get();
        const members = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            startDate1: format(new Date(doc.data().startDate), 'dd-MMM-yyyy'),
            endDate: format(new Date(doc.data().endDate), 'dd-MMM-yyyy')
        }));

        // Fetch all transactions
        const transSnap = await db.collection('transaction').get();
        const transactions = transSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Club transactions with members
        const membersWithTransactions = members.map(member => {
            let memberTransactions = transactions.filter(
                t => t.transaction_person_name === member.id
            );
            // Sort by transaction_time_stamp descending
            memberTransactions = memberTransactions.sort((a, b) => {
                const aTime = a.transaction_time_stamp?._seconds || 0;
                const bTime = b.transaction_time_stamp?._seconds || 0;
                return bTime - aTime;
            });
            return {
                ...member,
                transactions: memberTransactions
            };
        });

        return res.json(membersWithTransactions);
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
};

// Update member details
const updateMember = async (req, res) => {
    const id = req.params.id;
    const {
        name, age, package: packageMonth, startDate, gender, mobile, payment,
        cardio, profilePicUrl, aadharFrontUrl, aadharBackUrl
    } = req.body;
    try {
        const endDate = calculateEndDate(startDate, Number(packageMonth));
        const updateData = {
            name, age, gender, mobile, package: packageMonth, startDate, endDate,
            paymentMethod: payment, cardio
        };
        if (profilePicUrl) updateData.profilePicUrl = profilePicUrl;
        if (aadharFrontUrl) updateData.aadharFrontUrl = aadharFrontUrl;
        if (aadharBackUrl) updateData.aadharBackUrl = aadharBackUrl;
        await db.collection('gymMembers').doc(id).update(updateData);
        // Return updated member
        const updatedDoc = await db.collection('gymMembers').doc(id).get();
        return res.json({ message: "Success", member: { id, ...updatedDoc.data() } });
    } catch (err) {
        return res.status(500).json("Error");
    }
};

// Members whose package is ending in <= 7 days and > 0 days
const packageEnding = async (req, res) => {
    try {
        const today = new Date();
        const snapshot = await db.collection('gymMembers')
            .where('delete_flag', '!=', 1)
            .get();

        const members = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(member => {
                const daysLeft = Math.ceil((new Date(member.endDate) - today) / (1000 * 60 * 60 * 24));
                return daysLeft <= 7 && daysLeft > 0;
            })
            .map(member => ({
                name: member.name,
                mobile: member.mobile,
                endDate: format(new Date(member.endDate), 'dd-MMM-yyyy'),
                days_left: Math.ceil((new Date(member.endDate) - today) / (1000 * 60 * 60 * 24)),
                transaction_amount_due: member.transaction_amount_due || 0
            }));

        return res.json(members);
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
};

// Members whose package is expired (days_left <= 0)
const packageExpired = async (req, res) => {
    try {
        const today = new Date();
        const snapshot = await db.collection('gymMembers')
            .where('delete_flag', '!=', 1)
            .get();

        const members = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(member => {
                const daysLeft = Math.ceil((new Date(member.endDate) - today) / (1000 * 60 * 60 * 24));
                return daysLeft <= 0;
            })
            .map(member => ({
                name: member.name,
                mobile: member.mobile,
                endDate: format(new Date(member.endDate), 'dd-MMM-yyyy'),
                days_left: Math.ceil((new Date(member.endDate) - today) / (1000 * 60 * 60 * 24)),
                transaction_amount_due: member.transaction_amount_due || 0
            }));

        return res.json(members);
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
};

// Renew member's package
const renewMember = async (req, res) => {
    const memberId = req.params.id;
    const {
        package: packageMonth,
        startDate,
        paymentMethod,
        cardio,
        amountPaid // Add this if you track payment on renewal
    } = req.body;
    try {
        const endDate = calculateEndDate(startDate, Number(packageMonth));
        const updateData = {
            package: packageMonth,
            startDate,
            endDate,
            paymentMethod
        };
        if (cardio !== undefined) updateData.cardio = cardio;
        if (amountPaid !== undefined) updateData.amountPaid = amountPaid;
        await db.collection('gymMembers').doc(memberId).update(updateData);
        // Optionally, return updated member
        const updatedDoc = await db.collection('gymMembers').doc(memberId).get();
        return res.status(200).json({
            message: "Member renewed successfully",
            member: { id: memberId, ...updatedDoc.data() }
        });
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
};

// Append a renewal history entry to a member
const appendRenewalHistory = async (req, res) => {
    const memberId = req.params.id;
    const {
        renewalDate,
        packageName,
        amount,
        startDate,
        endDate,
        paymentMethod,
        staff,
        notes
    } = req.body;
    try {
        const historyEntry = {
            renewalDate,
            packageName,
            amount,
            startDate,
            endDate,
            paymentMethod,
            staff,
            notes
        };
        await db.collection('gymMembers').doc(memberId).update({
            history: admin.firestore.FieldValue.arrayUnion(historyEntry)
        });
        res.status(200).json({ message: "Renewal history appended successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error appending history", error: err.message });
    }
};

// Get only member names (for dropdowns etc.)
const getOnlyMember = async (req, res) => {
    try {
        const snapshot = await db.collection('gymMembers').where('delete_flag', '!=', 1).get();
        const members = snapshot.docs.map(doc => ({
            value: doc.data().name,
            label: doc.data().name
        }));
        return res.json(members);
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
};

module.exports = {
    addMember,
    deleteMember,
    getMember,
    updateMember,
    packageEnding,
    packageExpired,
    getOnlyMember,
    renewMember,
    appendRenewalHistory
};