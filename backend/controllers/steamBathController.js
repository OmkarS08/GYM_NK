const db = require('../config/firebaseConfig');

// Add a new steam bath entry
const addSteamBath = async (req, res) => {
    const { members, date, time } = req.body;
    try {
        const membersString = Array.isArray(members) ? members.join(', ') : members;
        await db.collection('steam').add({
            Steam_members: membersString,
            Steam_date: date,
            Steam_time: time,
            steam_delete_flag: 0,
            createdAt: new Date()
        });
        return res.json("Success");
    } catch (err) {
        return res.status(500).json({ message: "Error in Backend", error: err.message });
    }
};

// Get all steam bath entries (excluding deleted)
const getSteamData = async (req, res) => {
    try {
        const snapshot = await db.collection('steam')
            .where('steam_delete_flag', '!=', 1)
            .orderBy('Steam_date', 'asc')
            .get();
        const steamData = snapshot.docs.map(doc => {
            const data = doc.data();
            // Format date as dd-MMM-yyyy
            let formattedDate = '';
            if (data.Steam_date) {
                const dateObj = new Date(data.Steam_date);
                formattedDate = dateObj.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }).replace(/ /g, '-');
            }
            return {
                steam_id: doc.id,
                Steam_members: data.Steam_members,
                Steam_date: formattedDate,
                Steam_time: data.Steam_time
            };
        });
        return res.json(steamData);
    } catch (err) {
        return res.status(500).json({ message: "Error in Backend", error: err.message });
    }
};

// Soft delete a steam bath entry
const deleteSteam = async (req, res) => {
    const id = req.params.id;
    try {
        await db.collection('steam').doc(id).update({ steam_delete_flag: 1 });
        return res.json({ message: "Steam entry deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Error in Backend", error: err.message });
    }
};

module.exports = { addSteamBath, getSteamData, deleteSteam };