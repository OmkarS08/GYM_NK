const db = require('../config/firebaseConfig');

// Log an activity
const Activity = async (req, res) => {
    const { user_id, activity } = req.body;
    try {
        await db.collection('activityLog').add({
            activity_user_id: user_id,
            activity,
            time_stamp: new Date()
        });
        res.status(200).send('Activity logged successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Get all activities with user email
const getActivity = async (req, res) => {
    try {
        const activitySnap = await db.collection('activityLog').orderBy('time_stamp', 'desc').get();
        const userSnap = await db.collection('adminUser').get();
        const users = {};
        userSnap.docs.forEach(doc => {
            users[doc.id] = doc.data();
        });

        const activities = activitySnap.docs.map(doc => {
            const a = doc.data();
            const user = users[a.activity_user_id] || {};
            return {
                activity_id: doc.id,
                activity: a.activity,
                time_stamp: a.time_stamp?.toDate ? a.time_stamp.toDate().toISOString().slice(0, 19).replace('T', ' ') : '',
                username: user.email || ''
            };
        });
        res.status(200).send(activities);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = { Activity, getActivity };