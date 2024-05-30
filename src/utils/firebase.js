const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://healthylicious-1-default-rtdb.asia-southeast1.firebasedatabase.app"
});

module.exports = admin;
