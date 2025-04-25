// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
//const { getAnalytics } = require("firebase/analytics");
const { getStorage } = require("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDn-gcHwVy761yrYvK7uizRXYjpXE-hg44",
  authDomain: "socialuploader-95dab.firebaseapp.com",
  projectId: "socialuploader-95dab",
  storageBucket: "socialuploader-95dab.firebasestorage.app",
  messagingSenderId: "267122102828",
  appId: "1:267122102828:web:f80efa35a6249d4e713789",
  measurementId: "G-TSQ1LX1XL8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const storage = getStorage(app);
module.exports = { storage };

