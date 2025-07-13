const db = require('../config/firebaseConfig');

// Get all packages
const getPackage = async (req, res) => {
    try {
        const snapshot = await db.collection('package').get();
        const packages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return res.json(packages);
    } catch (err) {
        return res.status(500).json({ message: "Error in Backend", error: err.message });
    }
};

// Update package price by packageId
const updatePackage = async (req, res) => {
    const { packageId, amountWithCardio, amountWithoutCardio } = req.body;

    try {
        const snapshot = await db.collection('package').where('packageId', '==', Number(packageId)).get();
        if (snapshot.empty) {
            return res.status(404).send('Package not found');
        }
        const docId = snapshot.docs[0].id;
        await db.collection('package').doc(docId).update({
            packagePriceWithCardio: Number(amountWithCardio),
            packagePriceWithoutCardio: Number(amountWithoutCardio)
        });
        return res.status(200).send('Success');
    } catch (err) {
        return res.status(500).send('Server Error');
    }
};

// Get package amount by month
const getPackageAmount = async (req, res) => {
    const packageMonth = Number(req.params.month);
    try {
        const snapshot = await db.collection('package').where('packageMonth', '==', packageMonth).get();
        if (snapshot.empty) {
            return res.status(404).send('Package not found');
        }
        const packageData = snapshot.docs[0].data();
        // Return both prices
        return res.status(200).json({
            packagePriceWithCardio: packageData.packagePriceWithCardio,
            packagePriceWithoutCardio: packageData.packagePriceWithoutCardio
        });
    } catch (err) {
        return res.status(500).send('Server Error');
    }
};

module.exports = { getPackage, updatePackage, getPackageAmount };