import { Platform } from "react-native";
import { firebase } from '@firebase/app'
import '@firebase/storage'
import '@firebase/database'
import '@firebase/firestore'
import '@firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyDzkEuiLvUrNZYdU6blvHgVoHBf2tniZO0",
    authDomain: "jupebstudyapp.firebaseapp.com",
    projectId: "jupebstudyapp",
    storageBucket: "jupebstudyapp.appspot.com",
    messagingSenderId: "316815533405",
    appId: "1:316815533405:web:b0e02fdcf37e5c5cf8b4b4",
    measurementId: "G-XFLZXCNJ44"
};

if (Platform.OS === 'web') {
    firebase.initializeApp(firebaseConfig);
} else {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
}

export const firestoreDB = firebase.firestore()
export const database =  firebase.database()
export const auth  = firebase.auth()