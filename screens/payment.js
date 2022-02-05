import React, {useState, useRef} from 'react';
import PaystackWebView from "react-native-paystack-webview";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebase from 'firebase';
import * as network from 'expo-network';
import {
    Text,
    TextInput,
    View,
    BackHandler,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Linking,
    Alert,
} from 'react-native';

import colors from '../styles/colors.js'
import styles from '../styles/master.js';
import pageStyles from '../styles/paymentStyles.js';

const userData = {
    email: '',
    phone: '',
    school: '',
    acc_name: '',
  }

let is_bank_form_displayed = false
let is_deposit_acc_details_displayed = false
let is_chartup_card_displayed = false

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
  
require('firebase/database')
require('firebase/auth')

if (!firebase.apps.length) { //if firebase hasnt been initialized
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

export default function Register({navigation}) {
    const database = firebase.database()
    const auth  = firebase.auth()
    const paymentRequests = database.ref('paymentRequests')
    const users = database.ref('users')

    const [bank_Form_State, setbank_Form_State] = useState()
    const [deposit_acc_details, setdeposit_acc_details] = useState()
    const [chartup_card, setchartup_card] = useState()
    const [message, setmessage] = useState()

    const pinRef = useRef({pin: '',})

    const paystackWebViewRef = useRef()

    function openMenu () {
        navigation.openDrawer();
    }

    BackHandler.addEventListener('hardwareBackPress', function () {
        if (!is_bank_form_displayed || !navigation.isFocused()) { //if a card is not beeing displayed and the main screen isnt in focus
            return false
        } else {
            if (is_chartup_card_displayed) {
                close_chartup_card()
            }else if (is_deposit_acc_details_displayed) {
                close_deposit_acc_details_card()
            } else {
                close_bank_card()
            }
            return true;
        }
    });

    function dispaly_Bank_Form() {
        if (!is_bank_form_displayed) {
            setbank_Form_State(
                <View style={pageStyles.bankPaymentForm}>
                    <Text style={pageStyles.formHeader}>PERSONAL INFO.</Text>
                    <TouchableOpacity onPress = {close_bank_card} style={pageStyles.closeButn}>
                        <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                    </TouchableOpacity>
                    <TextInput style={pageStyles.formText} onChangeText={(val) => {userData.acc_name = val.toLowerCase()}} placeholder={'Account Name'} placeholderTextColor={colors.textColor}/>
                    <TextInput style={pageStyles.formText} onChangeText={(val) => {userData.phone = val.toLowerCase()}} keyboardType={'numeric'} placeholder={'Phone Number'} placeholderTextColor={colors.textColor}/>
                    <TextInput style={pageStyles.formText} onChangeText={(val) => {userData.school = val.toLowerCase()}} placeholder={'School Name'} placeholderTextColor={colors.textColor}/>

                    <TouchableOpacity onPressIn={handle_Bank_Payment} style={pageStyles.nextButn}>
                        <Text style={pageStyles.nextButnText}>NEXT</Text>
                    </TouchableOpacity>
                </View>
            )
            is_bank_form_displayed = true
        }
    }

    function close_bank_card() {
        setbank_Form_State()
        setmessage()
        is_bank_form_displayed = false
    }

    async function handle_Bank_Payment() {
        if (!userData.acc_name.length || !userData.phone.length || !userData.school.length) {
            setmessage('One or more fields are empty')
        } else {
            display_deposit_acc_details()
        }
    }
    
    function display_deposit_acc_details() {
        if (!is_deposit_acc_details_displayed) {
            setmessage('Pay to The Account Above. Confirm details before making payment.')
            setdeposit_acc_details(
                <View style={pageStyles.bankPaymentForm}>
                    <Text style={pageStyles.formHeader}>Deposit Account Info</Text>
                    <TouchableOpacity onPress = {close_deposit_acc_details_card} style={pageStyles.closeButn}>
                        <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                    </TouchableOpacity>
                    <Text style={[pageStyles.formText]}>
                        Bank: FCMB
                    </Text>
                    <Text style={[pageStyles.formText]}>
                        Account No. 6592915015
                    </Text>
                    <Text style={[pageStyles.formText]}>
                        Account Name: Iwuoha Kelechi Emmanuel.
                    </Text>
                    <Text style={[pageStyles.formText]}>
                        Amount: ₦1,500
                    </Text>
    
                    <TouchableOpacity onPressIn={processData} style={pageStyles.nextButn}>
                        <Text style={pageStyles.nextButnText}>DONE</Text>
                    </TouchableOpacity>
                </View>
            )
            is_deposit_acc_details_displayed = true
        }
    }

    function close_deposit_acc_details_card() {
        setdeposit_acc_details()
        setmessage()
        is_deposit_acc_details_displayed = false
    }

    const processData = async () => {
        userData.email = await AsyncStorage.getItem('userEmail')
        const query = users.orderByChild('email').equalTo(userData.email).limitToFirst(1)
        query.once('value', snapshot => {
            let uid = Object.keys(snapshot.val())[0] //use auth uid as key in rtdb
            paymentRequests.child(uid).set({...userData, paymentDate: new Date().getTime()})
            .then(users.child(uid).update({loggedIn: false}))
            .then(display_chartup_card)
        }).catch(Alert.alert('',"Can't Reach Database Now!"))
    }

    async function removeToken() {
        await AsyncStorage.setItem('vpa', 'false')
    }

    // removeToken()

    function display_chartup_card() {
        if (!is_chartup_card_displayed) {
            setchartup_card(
                <View style={pageStyles.bankPaymentForm}>
                    <Text style={pageStyles.formHeader}>Verification Request</Text>
                    <TouchableOpacity onPress = {close_chartup_card} style={pageStyles.closeButn}>
                        <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={pageStyles.chartUpButn} onPressIn={() => {Linking.openURL(`https://wa.me/+2348067124123?text=I%20have%20succesfully%20paid%20and%20require%20my%20pin%20for%20validation.\nAccount%20Name: ${userData.acc_name}`)}}>
                        <Text style={pageStyles.chartUpButnText}>
                            Notify Admin on WhatsApp - HOLGET
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={pageStyles.chartUpButn} onPressIn={() => {Linking.openURL(`https://wa.me/+2348067340115?text=I%20have%20succesfully%20paid%20and%20require%20my%20pin%20for%20validation.\nAccount%20Name: ${userData.acc_name}`)}}>
                        <Text style={pageStyles.chartUpButnText}>
                            Notify Admin on WhatsApp - KYLE
                        </Text>
                    </TouchableOpacity>
                </View>
            )
           is_chartup_card_displayed = true
        }
    }

    function close_chartup_card() {
        setchartup_card()
        setmessage()
        is_chartup_card_displayed = false
    }

    const VALIDATION_FUNCTION = async pin => {
        Alert.alert(
            '',
            'Activating Account...',
            [] //removes default ok button
        )
        const userEmail = await AsyncStorage.getItem('userEmail')
        if (userEmail) {
            const query = users.orderByChild('email').equalTo(userEmail).limitToFirst(1)
            let uid
            query.once('value', async snapshot => {
                for (const key in snapshot.val()) {
                    if (Object.hasOwnProperty.call(snapshot.val(), key)) {
                        uid = key
                    }
                }
                
                const IS_PIN_CORRECT = await CHECK_PIN(pin, uid)

                if (IS_PIN_CORRECT) {
                    users.child(uid).update({vpa: true, dateValidated: new Date().getTime()}).then( async () => {
                        await AsyncStorage.setItem('vpa', 'true')
                        await paymentRequests.child(uid).remove()
                        Alert.alert('Account Successfully Activated','You Can Now Enjoy The Full Features Of This App!')
                    }).catch(Alert.alert('',"Can't Reach Database Now!"))
                }
                
            }).catch(Alert.alert('',"Can't Reach Database Now!"))
        }
    }

    const CHECK_PIN = async  (pin, uid) => {
        let is_payment_validated = false
        if (pin) {
            await paymentRequests.child(uid).once('value', snapshot => {
                if (snapshot.val()) {
                    if (pin === snapshot.val().currentPin) {
                        console.log(pin === snapshot.val().currentPin);
                        is_payment_validated = true
                    } else {
                        Alert.alert('','Incorrect Pin')
                    }
                } else {
                    Alert.alert('', "You haven't sent any payment request")
                }
            }).catch(Alert.alert('',"Can't Reach Database Now!"))
        } else { /* this is incase user uses card activation instead of pin */
            is_payment_validated = true /** because the payment is validated by paystack we simply just set is_payment_validated to true */
        }
        console.log(is_payment_validated);
        return is_payment_validated
    }
    

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: colors.appColor}]}>
            <View style={styles.headerCont}>
                <Text style={styles.baseText}>PAYMENT</Text>
                <TouchableOpacity style={styles.menuIcon} onPress={openMenu}>
                    <Image source={require('../icons/menuIcon.png')}/>
                </TouchableOpacity>
            </View>

            <View style={pageStyles.cardAreaHeader}>
                <Text style={pageStyles.cardHeaderText}>Payment is required in other to leverage the full features of the app</Text>
            </View>

            <TouchableOpacity onPress={()=> paystackWebViewRef.current.StartTransaction()} style={pageStyles.cardArea}>
                <Text style={pageStyles.cardText}>Pay With Card: ₦1,500</Text>
            </TouchableOpacity>

            
            <TouchableOpacity onPressIn={dispaly_Bank_Form} style={pageStyles.cardArea}>
                <Text style={pageStyles.cardText}>Bank Transfer: ₦1,500</Text>
            </TouchableOpacity>

            <View  style={pageStyles.cardArea}>
                <TextInput onChangeText={val => {
                    pinRef.current.pin = val.toUpperCase()

                    pinRef.current.pin.length === 15? VALIDATION_FUNCTION(pinRef.current.pin): 'Pin Incomplete!'
                }} placeholder={'Input Purchased Pin If You Have One?'} placeholderTextColor={colors.textColor} style={pageStyles.cardText}/>
            </View>

            <Text style={pageStyles.info}>
                Payment can be made through cards {'\n'}
                or bank transfers.
                We recomend you {'\n'}
                use your card. So you can get verified quickly.
            </Text>

            <View style={pageStyles.galarey}>
                <Image resizeMode={'center'} style={[pageStyles.paymentPlatforms]} source={require('../icons/masterCard.png')}/>
                <Image resizeMode={'center'} style={[pageStyles.paymentPlatforms]} source={require('../icons/visa.png')}/>
                <Image resizeMode={'center'} style={[pageStyles.paymentPlatforms]} source={require('../icons/verve.png')}/>
                <Image resizeMode={'center'} style={[pageStyles.paymentPlatforms]} source={require('../icons/firstBank.png')}/>
                <Image resizeMode={'center'} style={[pageStyles.paymentPlatforms]} source={require('../icons/gtBank.png')}/>
                <Image resizeMode={'center'} style={[pageStyles.paymentPlatforms]} source={require('../icons/zeneth.png')}/>
                <Image resizeMode={'center'} style={[pageStyles.paymentPlatforms]} source={require('../icons/uba.png')}/>
                <Image resizeMode={'center'} style={[pageStyles.paymentPlatforms]} source={require('../icons/access.png')}/>
            </View>

            {bank_Form_State}
            {deposit_acc_details}
            <Text style={pageStyles.message}>{message}</Text>
            {chartup_card}
            
            <View style={{zIndex: -1}}>
                <View style={{zIndex: -20}}>
                        <PaystackWebView
                        buttonText="Pay Now"
                        showPayButton={false}
                        style={{color: '#eee'}}
                        paystackKey="pk_live_846661c27fb64e2d951b78d9acd4f5d35034db14"
                        amount={1500}
                        billingEmail="learnextra2@gmail.com"
                        billingMobile="07084973294"
                        billingName="Emmanuel Iwuoha"
                        ActivityIndicatorColor="green"
                        refNumber={Math.floor((Math.random() * 1000000000) + 1)}
                        SafeAreaViewContainer={{ marginTop: 5 }}
                        SafeAreaViewContainerModal={{ marginTop: 5 }}
                        onCancel={(e) => {
                            // handle response here
                        }}
                        onSuccess={res => {
                            VALIDATION_FUNCTION()
                        }}
                        ref={paystackWebViewRef}
                    />
                </View>
            </View>
            <StatusBar style="light"/>
        </SafeAreaView>
    )
    
}