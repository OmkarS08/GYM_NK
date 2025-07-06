const admin = require('firebase-admin');
const serviceAccount = require('./gymmanagement-70538-firebase-adminsdk-fbsvc-9db73faa79.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;