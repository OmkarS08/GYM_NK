
import api from '../api/api';
const logActivity = async (userId, activity) => {
    try {
        const response = await api.post('/activityLog/addActivity', {
            user_id: userId,
            activity: activity
        });
        console.log(response.status);
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

export default logActivity;
