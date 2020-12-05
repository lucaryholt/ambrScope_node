const firebaseApp = require('./firebase.js');

const db = firebaseApp.firestore();
const col = db.collection(process.env.FIREBASE_COLLECTION_NAME);

module.exports = col;