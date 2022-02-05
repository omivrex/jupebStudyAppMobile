import React, {Text} from "react"
import styles from '../styles/master.js';

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
          await auth.signInWithEmailAndPassword(userData.email, userData.password).then(
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

export default logUserIn