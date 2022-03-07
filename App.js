import React, {useState} from 'react';
import Navigator from './stacks/drawer.js';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebase from 'firebase';
import * as network from 'expo-network';
import styles from './styles/master.js';
import {firestoreDB, database, auth} from "./utils/firebase.config"

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

const users = database.ref('users')
const userData = {
  email: '',
  password: '',
  phone: '',
  school: '',
  loggedIn: true,
}


require('firebase/firestore')
require('firebase/database')
require('firebase/auth')

let isSignUpCardDisplayed = false
let isLoginCardDisplayed = false
let isSplashCardDisplayed = false
let isCard_displayed = false
let is_app_screen_displayed = false
let isUpdateFeatureCard = false

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export default function App({navigation}) {
  const [signUpCard, setsignUpCard] = useState()
  const [logInCard, setlogInCard] = useState()
  const [splashCard, setsplashCard] = useState()
  const [updateFeatureCard, setupdateFeatureCard] = useState()
  const [message, setmessage] = useState()
  const [navScreen, setnavScreen] = useState()
  
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
    // AsyncStorage.removeItem(('vpa'))
    try {
      let token = await AsyncStorage.getItem('vpa')
      if (token!=null) {
        console.log(token, 'line 81');
        return true
      } else{
        return false
      }
    } catch (error) {
      console.log(error);
    }
  }

  function DISPLAY_UPDATE_FEATURE_CARD() {
    if (!isUpdateFeatureCard) {
      setupdateFeatureCard(
        <View style={styles.splashCard}>
          <Image resizeMode={'center'} style={styles.splashImg} source={require('./icons/applogo.png')}/>
          <Text style={{alignSelf: 'center', textAlign: 'center', color: colors.orange, position: 'absolute', top: hp('57%'), fontSize: hp('2.8%')}}>
            Update Your App
          </Text>
          <Text style={{textDecorationLine: 'underline', alignSelf: 'center', fontSize: hp('3%'), color: colors.textColor, top: hp('65%'), position: 'absolute'}} onPress={()=> Linking.openURL('http://play.google.com/store/apps/details?id=com.learnxtra.jupebstudyapp')}>Click To Update</Text>
        </View>
      )
    }
    isUpdateFeatureCard = true
  }

  function displaySplashCard() {
    GET_TOKEN_AND_APP_VERSION().then(
      (isToken) => {
        if (!isToken) { // if token is not found then display splash card
          if (!isSplashCardDisplayed) {
            setsplashCard(
              <View style={styles.splashCard}>
                  <Image resizeMode={'center'} style={styles.splashImg} source={require('./icons/applogo.png')}/>
                  <TouchableOpacity onPressIn={display_login_card} style={[styles.splashButns]}>
                    <Text style={styles.splashButnText}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPressIn={display_signup_card} style={[styles.splashButns]}>
                    <Text style={[styles.splashButnText, styles.signUpCardButnText]}>New User? <Text style={{textDecorationLine: 'underline'}}>Sign Up</Text></Text>
                  </TouchableOpacity>
                  <Text style={[styles.privacyLink]} onPress={()=> {Linking.openURL('https://www.privacypolicies.com/live/a9c5604c-4991-4768-a93a-3819c9eb688b')}}>
                    Privcy Policy
                  </Text>
              </View>
            )
            isSplashCardDisplayed = true
          }
        } else{
          displayAppScreen()
        }
    })
  }

  function display_login_card() {
    if (!isLoginCardDisplayed) {
      setlogInCard(
        <View style={styles.cards}>
          <Text style={styles.cardHeader}>Login</Text>
          <TextInput autoCapitalize='none' onChangeText={(val) => {userData.email = val.toLowerCase()}} style={styles.textInput} keyboardType={'email-address'} placeholder="Email"/>
          <TextInput autoCapitalize='none' onChangeText={(val) => {userData.password = val.toLowerCase()}} style={styles.textInput} secureTextEntry={true} placeholder="Password"/>
          <TouchableOpacity onPressIn={logUserIn} style={styles.cardButn}>
            <Text style={styles.cardButnText}>Login</Text>
          </TouchableOpacity>
        </View>
      )
      isLoginCardDisplayed = true
      isCard_displayed = true
    }

    isSignUpCardDisplayed = false
    display_signup_card()

  }

  async function logUserIn() {
    if (userData.email === '') {
      setmessage(<Text style={[styles.message, {display: 'flex', color: 'red', top: hp('47%')}]}>Fill in your email!</Text>)
    } else if (userData.password === '') {
      setmessage(<Text style={[styles.message, {display: 'flex', color: 'red', top: hp('47%')}]}>Fill in your password!</Text>)
    } else {
      setmessage(<Text style={[styles.message, {display: 'flex', top: hp('47%')}]}>Loggin You In...</Text>)
      try {
        const networkStat = await network.getNetworkStateAsync()
        if (networkStat.isInternetReachable) {
          await auth.signInWithEmailAndPassword(userData.email.replace(/ /g,''), userData.password).then(
            () => {
              auth.onAuthStateChanged(user => {
                if (user) {
                  users.child(user.uid).once('value', snapshot => {
                    if (snapshot.val().loggedIn == false) {
                      console.log(snapshot.val().loggedIn);
                      users.child(user.uid).update({loggedIn: true}).then(
                        () => {
                          if (snapshot.val().vpa) {
                            processData(snapshot.val().vpa)
                          } else {
                            processData()
                          }
                        }
                      )
                    } else {
                      setmessage(
                        <Text style={[styles.message, {display: 'flex', color: 'red', top: hp('47%')}]}>
                          Another user is loggedIn With This Account!
                        </Text>)
                    }
                  })
                }
              })
            })
          .catch(error => errHandler(error))
        }
      } catch (error) {
        setmessage(<Text style={[styles.message, {display: 'flex', color: 'red', top: hp('47%')}]}>You seem to be having bad network or no internet connection!</Text>)
      }
    }
  }

  const processData = vpa => {
    setmessage(<Text style={[styles.message, {display: 'flex', top: hp('47%')}]}>Loggin Successful!</Text>)
    setTimeout(() => { //this is to ensure that the user sees the mssage above in othher to know his loged in is sucessfull
      saveUserData(vpa)
    }, 1500);
  }
  
  const errHandler = err => {
    let no_exisiting_user_with_email = 'There is no user record corresponding to this identifier. The user may have been deleted.'
    let incorrect_pswd = 'The password is invalid or the user does not have a password.'

    if (err === no_exisiting_user_with_email) {
      setmessage(<Text style={[styles.message, {display: 'flex', color: 'red', top: hp('47%')}]}>No user with this email!</Text>)
    } else if (err = incorrect_pswd) {
      setmessage(
        <Text style={[styles.message, {display: 'flex', color: 'red', top: hp('47%')}]}>
          Your Email or Password Is Incorrect!
          {'\n'}
          <Text onPress={resetPassword} style={{textDecorationLine: 'underline'}}>Reset Password</Text>
        </Text>
      )
    } else {
      setmessage(<Text style={[styles.message, {display: 'flex', color: 'red', top: hp('47%')}]}>Network Error!</Text>)
    }
    console.log(err);
  }

  const resetPassword = () => {
    auth.sendPasswordResetEmail(userData.email).then(() => {
      Alert.alert('Passord Reset Email Sent!', 'Check Your Email For The Link Sent To You')
    })
  }
  
  

  function display_signup_card() {
    if (!isSignUpCardDisplayed) {
      setsignUpCard(
        <View style={styles.cards}>
          <Text style={styles.cardHeader}>SignUp</Text>
          <TextInput autoCapitalize="none" onChangeText={(val) => {userData.email = val.toLowerCase()}} style={styles.textInput} keyboardType={'email-address'} placeholder="Email"/>
          <TextInput autoCapitalize="none" onChangeText={(val) => {userData.password = val.toLowerCase()}} style={styles.textInput} secureTextEntry={true} placeholder="Password"/>
          <TextInput autoCapitalize="none" onChangeText={(val) => {userData.phone = val.toLowerCase()}} style={styles.textInput} keyboardType={'number-pad'} placeholder="Phone Number"/>
          <TextInput autoCapitalize="none" onChangeText={(val) => {userData.school = val.toLowerCase()}} style={styles.textInput} placeholder="School"/>
          <TouchableOpacity style={styles.cardButn} onPressIn={validateData}>
            <Text style={styles.cardButnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      )
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
  
  function validateData() {
    setmessage(<Text style={[styles.message, {display: 'flex'}]}>Signing You Up...</Text>)
    let emailname = userData.email.slice(0, userData.email.indexOf('@'))
    let emailProvider = userData.email.slice(userData.email.indexOf('@')+1, userData.email.indexOf('.com'))
    // if email does not have @ or .com or if email name is not validated
    /* as true and email provider is not validated as true and phone
    /* does not have 11 digits and phone is not validated as true */
    if (userData.email.indexOf('@') === -1 || userData.email.indexOf('.com') === -1 || !validateEmail(emailname) || !validateEmail(emailProvider)) { 
      setmessage(<Text style={[styles.message, {color: 'red', display: 'flex'}]}>Invalid Email Address</Text>)
    } else if (userData.phone.length !== 11 || !validatePhone(userData.phone)) {
      setmessage(<Text style={[styles.message, {color: 'red', display: 'flex'}]}>Invalid Phone Number</Text>)
    } else if (userData.password.length < 6) {
      setmessage(<Text style={[styles.message, {color: 'red', display: 'flex'}]}>password must have at least 6 characters</Text>)
    } else if (!userData.school.length) {
      setmessage(<Text style={[styles.message, {color: 'red', display: 'flex'}]}>Input your school name</Text>)
    }  else {
      regUser()
    }
  } 

 async function regUser() {
    let {email, phone, school, loggedIn} = userData
    let uploadData = {email, phone, school, loggedIn, vpa: 'false', regDate: new Date().getTime()}
    try {
      const networkStat = await network.getNetworkStateAsync()
      if (networkStat.isInternetReachable) {
        const query = users.orderByChild('phone').equalTo(userData.phone).limitToFirst(1)
        query.once('value', snapshot => {
          if (snapshot.val() === null) { //check if another account has thesame phone number if not then sign up
            auth.createUserWithEmailAndPassword(userData.email, userData.password).then(() => {
              auth.onAuthStateChanged(async ({uid}) => {
                if (uid != null) {
                  users.child(uid).set(uploadData)
                  setmessage(<Text style={[styles.message, {display: 'flex'}]}>Signing Up Successful!</Text>)
                  setTimeout(() => {//this so the user can see the message above
                   saveUserData()
                  }, 1500);
                }
              })
  
            }).catch((err) => {
              console.log(err);
              setmessage(<Text style={[styles.message, {color: 'red', display: 'flex'}]}>The email address is already in use by another account.</Text>)
            })
          } else {
            setmessage(<Text style={[styles.message, {color: 'red', display: 'flex'}]}>The phone number is already in use by another account.</Text>)
          }
        })
      }
    } catch (err) {
      setmessage(<Text style={[styles.message, {display: 'flex', color: 'red', top: hp('67%')}]}>You seem to be having bad network or no internet connection!</Text>)
      console.log(err);
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