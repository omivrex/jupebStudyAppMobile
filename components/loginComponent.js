import React from 'react';
import styles from '../styles/master.js';
import logUserIn from '../Scripts/loginUser.js';

const LoginComponent = ({userData, changeMessageState}) => {
  return (
    <View style={styles.cards}>
        <Text style={styles.cardHeader}>Login</Text>
        <TextInput autoCapitalize='none' onChangeText={(val) => {userData.email = val.toLowerCase()}} style={styles.textInput} keyboardType={'email-address'} placeholder="Email"/>
        <TextInput autoCapitalize='none' onChangeText={(val) => {userData.password = val.toLowerCase()}} style={styles.textInput} secureTextEntry={true} placeholder="Password"/>
        <TouchableOpacity onPressIn={logUserIn} style={styles.cardButn}>
            <Text style={styles.cardButnText}>Login</Text>
        </TouchableOpacity>
    </View>
  )
}

export default LoginComponent;
