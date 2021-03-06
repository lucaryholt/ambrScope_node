const firebaseApp = require('./firebase.js');

const db = firebaseApp.firestore();
const col = db.collection(process.env.FIREBASE_COLLECTION_NAME);

const spots = [];
const listenerCallbacks = [];

col.onSnapshot((querySnapshot) => {
  spots.length = 0;
  querySnapshot.forEach((doc) => {
    spots.push(doc.data());
  });
  listenerCallbacks.map((callback) => {
    callback(spots);
  });
});

function listenForUpdates(callback) {
  listenerCallbacks.push(callback);
}

async function saveSpot(spot) {
  await col.doc(spot.id).set(spot);
}

async function deleteSpot(id) {
  await col.doc(id).delete();
}

async function findSpotsByUserID(userID) {
  return new Promise((resolve, reject) => {
    col.where('userID', '==', userID).get()
      .then((snapshot) => {
        const spots = [];
        snapshot.forEach((doc) => {
          spots.push(doc.data());
        });
        resolve(spots);
      }).catch((error) => {
        reject(error);
      });
  });
}

async function findSpotByID(id) {
  return new Promise((resolve, reject) => {
    col.doc(id).get()
      .then((doc) => {
        if (!doc.exists) reject();
        else resolve(doc.data());
      });
  });
}

module.exports = {
  col,
  spots,
  listenForUpdates,
  saveSpot,
  findSpotsByUserID,
  findSpotByID,
  deleteSpot,
};
