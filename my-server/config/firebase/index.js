// const firebase = require("firebase/app");

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_APIKEY,
//   authDomain: process.env.FIREBASE_AUTHDOMAIN,
//   projectId: process.env.FIREBASE_PROJECTID,
//   storageBucket: process.env.FIREBASE_STORAGEBUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGINGID,
//   appId: process.env.FIREBASE_APPID,
// };

// firebase.initializeApp(firebaseConfig);

// // Initialize Firebase
// module.exports = firebaseConfig;

const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGID,
  appId: process.env.FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase
module.exports = getAuth(app);
