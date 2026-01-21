// Firebase Configuration for Ski Tracker
const firebaseConfig = {
    apiKey: "AIzaSyDaMV4S3hraO5er6bczS4YwMRrz3LlaCXU",
    authDomain: "ski-tracker-25c30.firebaseapp.com",
    projectId: "ski-tracker-25c30",
    storageBucket: "ski-tracker-25c30.firebasestorage.app",
    messagingSenderId: "223719081096",
    appId: "1:223719081096:web:436aaf8f6be4dbec854b3d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence for Firestore
db.enablePersistence().catch(function(err) {
    if (err.code === 'failed-precondition') {
        console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
        console.log('The current browser does not support persistence.');
    }
});
