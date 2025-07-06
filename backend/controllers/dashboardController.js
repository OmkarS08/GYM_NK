const db = require('../config/firebaseConfig');

// Member count by gender and total
const memberCount = async (req, res) => {
    try {
        const snapshot = await db.collection('gymMembers').where('delete_flag', '!=', 1).get();
        const genderCounts = {};
        let total = 0;

        snapshot.docs.forEach(doc => {
            const member = doc.data();
            const gender = member.gender || 'Unknown';
            genderCounts[gender] = (genderCounts[gender] || 0) + 1;
            total += 1;
        });

        const result = Object.keys(genderCounts).map(gender => ({
            gender,
            gender_count: genderCounts[gender]
        }));

        result.push({ gender: 'Total', gender_count: total });

        return res.json(result);
    } catch (err) {
        return res.status(500).json("Error in Backend");
    }
};

// Bar chart: members joined per month (grouped by month and year)
const BarChart = async (req, res) => {
    try {
        const snapshot = await db.collection('gymMembers').where('delete_flag', '!=', 1).get();
        const monthCounts = {};

        snapshot.docs.forEach(doc => {
            const member = doc.data();
            if (member.startDate) {
                const date = new Date(member.startDate);
                const year = date.getFullYear();
                const month = date.toLocaleString('default', { month: 'long' });
                const key = `${year}-${month}`;
                monthCounts[key] = (monthCounts[key] || 0) + 1;
            }
        });

        const result = Object.keys(monthCounts).map(key => {
            const [year, month] = key.split('-');
            return {
                year,
                month,
                member_count: monthCounts[key]
            };
        });

        // Optionally sort by year and month
        result.sort((a, b) => {
            if (a.year === b.year) {
                return new Date(`${a.month} 1, 2000`) - new Date(`${b.month} 1, 2000`);
            }
            return a.year - b.year;
        });

        return res.json(result);
    } catch (err) {
        return res.status(500).json("Error in Backend");
    }
};

// Pie chart: package distribution
const PieChart = async (req, res) => {
    try {
        const snapshot = await db.collection('gymMembers').where('delete_flag', '!=', 1).get();
        const packageCounts = {};

        snapshot.docs.forEach(doc => {
            const member = doc.data();
            const pkg = member.package || 'Unknown';
            packageCounts[pkg] = (packageCounts[pkg] || 0) + 1;
        });

        const result = Object.keys(packageCounts).map(pkg => ({
            package: pkg,
            package_count: packageCounts[pkg]
        }));

        return res.json(result);
    } catch (err) {
        return res.status(500).json("Error in Backend");
    }
};

module.exports = { memberCount, BarChart, PieChart };