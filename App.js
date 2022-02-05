import React, {useState} from 'react';
import Navigator from './stacks/drawer.js';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebase from 'firebase';
import * as network from 'expo-network';
import SplashCard from './components/splashCard'
import styles from './styles/master.js';
import colors from './styles/colors.js'
import {
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
  Linking,
} from 'react-native';
import UpdateAppComponent from './components/updateApp.js';
import LoginComponent from './components/loginComponent.js';
import SignUpComponent from './components/signUpComponent.js';

const userData = {
  email: '',
  password: '',
  phone: '',
  school: '',
  loggedIn: true,
}


const firebaseConfig = {
  apiKey: "AIzaSyDzkEuiLvUrNZYdU6blvHgVoHBf2tniZO0",
  authDomain: "jupebstudyapp.firebaseapp.com",
  projectId: "jupebstudyapp",
  storageBucket: "jupebstudyapp.appspot.com",
  messagingSenderId: "316815533405",
  appId: "1:316815533405:web:b0e02fdcf37e5c5cf8b4b4",
  databaseURL: 'https://jupebstudyapp-default-rtdb.firebaseio.com/',
  measurementId: "G-XFLZXCNJ44"
};

require('firebase/firestore')
require('firebase/database')
require('firebase/auth')

let isSignUpCardDisplayed = false
let isLoginCardDisplayed = false
let isSplashCardDisplayed = false
let isCard_displayed = false
let is_app_screen_displayed = false
let isUpdateFeatureCard = false

if (!firebase.apps.length) { //if firebase hasnt been initialized
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}


export default function App({navigation}) {
  const [signUpCard, setsignUpCard] = useState()
  const [logInCard, setlogInCard] = useState()
  const [splashCard, setsplashCard] = useState()
  const [updateFeatureCard, setupdateFeatureCard] = useState()
  const [message, setmessage] = useState()
  const [navScreen, setnavScreen] = useState()

  const database =  firebase.database()
  const auth  = firebase.auth()
  const firestoreDB = firebase.firestore()
  const users = database.ref('users')
  
  BackHandler.addEventListener('hardwareBackPress', function () {
    if (!isCard_displayed) { //if a card is not beeing displayed and the main screen isnt in focus
      return false
    } else {
      setlogInCard()
      setsignUpCard()
      setmessage()
      isCard_displayed = false
      isLoginCardDisplayed = false
      isSignUpCardDisplayed = false
      return true;
    }
  });
  
  
  async function GET_TOKEN_AND_APP_VERSION () {
    try {
      const networkStat = await network.getNetworkStateAsync()
      if (networkStat.isInternetReachable) {
        await firestoreDB.collection('app-version').get().then((snapShot)=> {
          snapShot.forEach(info => {
            if (info.data().version != Constants.manifest.version) {
              DISPLAY_UPDATE_FEATURE_CARD()
            }
          });
        })
      }
    } catch (err) {
      console.log(err);
    }
    
    try {
      let token = await AsyncStorage.getItem('vpa')
      if (token!=null) {
        console.log(token, 'line 81');
        // return true
      }
      return false
    } catch (error) {
      console.log(error);
    }
  }

  function DISPLAY_UPDATE_FEATURE_CARD() {
    if (!isUpdateFeatureCard) {
      setupdateFeatureCard(<UpdateAppComponent/>)
    }
    isUpdateFeatureCard = true
  }

  function displaySplashCard() {
    GET_TOKEN_AND_APP_VERSION().then(
      (isToken) => {
        if (!isToken) { // if token is not found then display splash card
          if (!isSplashCardDisplayed) {
            setsplashCard(SplashCard)
            isSplashCardDisplayed = true
          }
        } else{
          displayAppScreen()
        }
    })
  }

  function display_login_card() {
    if (!isLoginCardDisplayed) {
      setlogInCard(<LoginComponent userData={userData} changeMessageState={setmessage}/>)
      isLoginCardDisplayed = true
      isCard_displayed = true
    }

    isSignUpCardDisplayed = false
    display_signup_card()

  }

  function display_signup_card() {
    if (!isSignUpCardDisplayed) {
      setsignUpCard(<SignUpComponent userData={userData} changeMessageState={setmessage}/>)
      isSignUpCardDisplayed = true
      isCard_displayed = true
    }

  }
  
  const validateEmail = text => {
    const validChars = new RegExp(/[abcdefghijklmnopqrstuvwxyz1234567890]/)
    if (text.search(validChars)!= -1) {
      return true
    } else {
      return false
    }
  }

  const validatePhone = phone => {
    //list of accepted phone prefixs in nigeria
    const validPrifix = [new RegExp(/\b070/), new RegExp(/\b080/), new RegExp(/\b081/), new RegExp(/\b090/), new RegExp(/\b091/)]
    //valid phone number chars
    const validChars = new RegExp(/[1234567890]/)
    //check if the numbers prefix is amongst the list then check if it has just digits and no letters or other char
    if (phone.search(validPrifix[0]) === 0 || phone.search(validPrifix[1]) === 0 || phone.search(validPrifix[2]) === 0 || phone.search(validPrifix[3]) === 0 || phone.search(validPrifix[4]) === 0) {
      if (phone.search(validChars) != -1) {
        return true
      } else {
        return false
      }
    } else { 
      return false
    }
  }

  const saveUserData = async vpa => {
    try {
      if (vpa === 'true' || vpa === true) {
        await AsyncStorage.setItem('vpa', 'true')
      } else {
        await AsyncStorage.setItem('vpa', 'false')
      }
      await AsyncStorage.setItem('userEmail', userData.email.toString())
      setlogInCard()
      isLoginCardDisplayed = false
      setsignUpCard()
      isSignUpCardDisplayed = false
      setsplashCard()
      isSplashCardDisplayed = false
      setmessage()
      isCard_displayed = false
      displayAppScreen()
    } catch (error) {
      console.log(error); 
    }
  }

  function displayAppScreen() {
    if (!is_app_screen_displayed) {
      setnavScreen(<Navigator/>)
      is_app_screen_displayed = true
    }
  }

//  AsyncStorage.removeItem('vpa')
//  AsyncStorage.removeItem('userEmail')
  return (
    <SafeAreaView style={{flex: 1}}>
      {navScreen}
      {displaySplashCard()}
      {updateFeatureCard}
      {splashCard}
      {signUpCard}
      {logInCard}
      {message}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}