const firebaseApp = require('./firebase.js');

const db = firebaseApp.firestore();
const col = db.collection(process.env.FIREBASE_COLLECTION_NAME);

let spots = [];
let listenerCallbacks = [];

col.onSnapshot(querySnapshot => {
    spots.length = 0;
    querySnapshot.forEach(doc => {
        spots.push(doc.data());
    });
    listenerCallbacks.map(callback => {
        callback(spots);
    });
});

function listenForUpdates(callback) {
    listenerCallbacks.push(callback);
}

module.exports = {
    col,
    spots,
    listenForUpdates
};