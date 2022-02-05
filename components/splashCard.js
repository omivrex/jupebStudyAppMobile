import React from 'react';
import styles from '../styles/master.js';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Linking,
} from 'react-native';

const SplashCard = () => {
  return (
    <View style={styles.splashCard}>
        <Image resizeMode={'center'} style={styles.splashImg} source={require('../icons/applogo.png')}/>
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
}

export default SplashCard