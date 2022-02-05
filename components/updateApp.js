import React from "react";
import styles from '../styles/master.js';
import {
    Text,
    View,
    Image,
    Linking,
} from 'react-native';

const UpdateAppComponent = () => {
  return (
    <View style={styles.splashCard}>
        <Image resizeMode={'center'} style={styles.splashImg} source={require('./icons/applogo.png')}/>
        <Text style={{alignSelf: 'center', textAlign: 'center', color: colors.orange, position: 'absolute', top: hp('57%'), fontSize: hp('2.8%')}}>
            Update Your App
        </Text>
        <Text style={{textDecorationLine: 'underline', alignSelf: 'center', fontSize: hp('3%'), color: colors.textColor, top: hp('65%'), position: 'absolute'}} onPress={()=> Linking.openURL('http://play.google.com/store/apps/details?id=com.learnxtra.jupebstudyapp')}>Click To Update</Text>
    </View>
  )
}

export default UpdateAppComponent