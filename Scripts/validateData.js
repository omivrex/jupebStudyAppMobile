import React, {Text} from "react"
import styles from '../styles/master.js';
import * as network from 'expo-network';

function validateData({userData, changeMessageState}) {
    let emailname = userData.email.slice(0, userData.email.indexOf('@'))
    let emailProvider = userData.email.slice(userData.email.indexOf('@')+1, userData.email.indexOf('.com'))
    // if email does not have @ or .com or if email name is not validated
    /* as true and email provider is not validated as true and phone
    /* does not have 11 digits and phone is not validated as true */
    if (userData.email.indexOf('@') === -1 || userData.email.indexOf('.com') === -1 || !validateEmail(emailname) || !validateEmail(emailProvider)) { 
      changeMessageState(<Text style={[styles.message, {color: 'red', display: 'flex'}]}>Invalid Email Address</Text>)
    } else if (userData.phone.length !== 11 || !validatePhone(userData.phone)) {
      changeMessageState(<Text style={[styles.message, {color: 'red', display: 'flex'}]}>Invalid Phone Number</Text>)
    } else if (userData.password.length < 6) {
      changeMessageState(<Text style={[styles.message, {color: 'red', display: 'flex'}]}>password must have at least 6 characters</Text>)
    } else if (!userData.school.length) {
      changeMessageState(<Text style={[styles.message, {color: 'red', display: 'flex'}]}>Input your school name</Text>)
    }  else {
      regUser(userData)
    }
}

async function regUser(userData) {
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

export default validateData;