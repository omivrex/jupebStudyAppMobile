import React from 'react';
import styles from '../styles/master.js';
import validateData from '../Scripts/validateData.js';
import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
} from 'react-native';

const SignUpComponent = ({userData, changeMessageState}) => {
    return (
        <View style={styles.cards}>
          <Text style={styles.cardHeader}>SignUp</Text>
          <TextInput autoCapitalize="none" onChangeText={(val) => {userData.email = val.toLowerCase()}} style={styles.textInput} keyboardType={'email-address'} placeholder="Email"/>
          <TextInput autoCapitalize="none" onChangeText={(val) => {userData.password = val.toLowerCase()}} style={styles.textInput} secureTextEntry={true} placeholder="Password"/>
          <TextInput autoCapitalize="none" onChangeText={(val) => {userData.phone = val.toLowerCase()}} style={styles.textInput} keyboardType={'number-pad'} placeholder="Phone Number"/>
          <TextInput autoCapitalize="none" onChangeText={(val) => {userData.school = val.toLowerCase()}} style={styles.textInput} placeholder="School"/>
          <TouchableOpacity style={styles.cardButn} onPressIn={()=> {
                changeMessageState(<Text style={[styles.message, {display: 'flex'}]}>Signing You Up...</Text>)
                validateData(userData)
          }}>
            <Text style={styles.cardButnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
    )
}

export default SignUpComponent;