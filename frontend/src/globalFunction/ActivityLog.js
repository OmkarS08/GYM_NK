// LogActivity.js
import axios from 'axios';

const logActivity = async (userId, activity) => {
    try {
        const response = await axios.post('https://gym-royal-fitness.onrender.com/activityLog/addActivity', {
            user_id: userId,
            activity: activity
        });
        console.log(response.status);
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

export default logActivity;
