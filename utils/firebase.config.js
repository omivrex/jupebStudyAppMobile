import * as firebase from 'firebase';
require('firebase/storage')
require('firebase/database')
require('firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyDzkEuiLvUrNZYdU6blvHgVoHBf2tniZO0",
    authDomain: "jupebstudyapp.firebaseapp.com",
    projectId: "jupebstudyapp",
    storageBucket: "jupebstudyapp.appspot.com",
    messagingSenderId: "316815533405",
    appId: "1:316815533405:web:b0e02fdcf37e5c5cf8b4b4",
    measurementId: "G-XFLZXCNJ44"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const firestoreDB = firebase.firestore()
export const database =  firebase.database()
export const auth  = firebase.auth()