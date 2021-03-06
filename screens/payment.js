import React, {useState, useRef} from 'react';
import PaystackWebView from "react-native-paystack-webview";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as network from 'expo-network';
import {database} from "../utils/firebase.config"
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
import { sendPaymentRequest, validatePayment } from '../utils/payment.utils';

const userData = {
    email: '',
    phone: '',
    school: '',
    acc_name: '',
  }

let is_bank_form_displayed = false
let is_deposit_acc_details_displayed = false
let is_chartup_card_displayed = false

export default function Register({navigation}) {
    const paymentRequests = database.ref('paymentRequests')
    const users = database.ref('users')

    const [bank_Form_State, setbank_Form_State] = useState()
    const [deposit_acc_details, setdeposit_acc_details] = useState()
    const [chartup_card, setchartup_card] = useState()

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
                    <TouchableOpacity onPress = {close_bank_card} style={pageStyles.closeButn}>
                        <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                    </TouchableOpacity>
                    <Text style={pageStyles.formHeader}>PERSONAL INFO.</Text>
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
        is_bank_form_displayed = false
    }

    async function handle_Bank_Payment() {
        if (!userData.acc_name.length || !userData.phone.length || !userData.school.length) {
            messageHandler({
                title: '',
                body: 'One or more fields are empty'
            })
        } else {
            display_deposit_acc_details()
        }
    }
    
    function display_deposit_acc_details() {
        if (!is_deposit_acc_details_displayed) {
            messageHandler({
                title: 'Pay to The Account Displayed.',
                body: 'Confirm details before making payment.'
            })
            setdeposit_acc_details(
                <View style={pageStyles.bankPaymentForm}>
                    <TouchableOpacity onPress = {close_deposit_acc_details_card} style={pageStyles.closeButn}>
                        <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                    </TouchableOpacity>
                    <Text style={pageStyles.formHeader}>Deposit Account Info</Text>
                    <Text style={[pageStyles.formText]}>
                        Account No. 6592915015
                    </Text>
                    <Text style={[pageStyles.formText]}>
                        Account Name: Iwuoha Kelechi Emmanuel.
                    </Text>
                    <Text style={[pageStyles.formText]}>
                        Bank: FCMB
                    </Text>
                    <Text style={[pageStyles.formText]}>
                        Amount: ???1,500
                    </Text>
    
                    <TouchableOpacity onPressIn={()=> {
                        Alert.alert('Are you sure you have made a payment to the details shown..', 
                        `Account No. 6592915015 \nAccount Name: Iwuoha Kelechi Emmanuel. \nBank: FCMB \nAmount: ???1,500`, [
                            {text: 'Yes', onPress: callSendPaymentReq},
                            {text: 'No', onPress: close_deposit_acc_details_card}
                        ])
                    }} style={pageStyles.nextButn}>
                        <Text style={pageStyles.nextButnText}>DONE</Text>
                    </TouchableOpacity>
                </View>
            )
            is_deposit_acc_details_displayed = true
        }
    }

    function close_deposit_acc_details_card() {
        setdeposit_acc_details()
        is_deposit_acc_details_displayed = false
    }

    const errorHandler = (message)=>{
        message? Alert.alert('', message):
        Alert.alert('Network Error!',"Check your Internet Connection And Try Again.", [{text: 'OK', onPress: ()=> null}], {cancelable: true})
    }

    const messageHandler = message => {
        Alert.alert(message.title, message.body, [{text: 'OK', onPress: ()=> null}], {cancelable: true})
    }

    const callSendPaymentReq = async () => {
        userData.email = await AsyncStorage.getItem('userEmail')
        await sendPaymentRequest(display_chartup_card, errorHandler, userData)
    }

    async function removeToken() {
        await AsyncStorage.setItem('vpa', 'false')
    }

    // removeToken()

    function display_chartup_card() {
        if (!is_chartup_card_displayed) {
            setchartup_card(
                <View style={pageStyles.bankPaymentForm}>
                    <TouchableOpacity onPress = {close_chartup_card} style={pageStyles.closeButn}>
                        <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                    </TouchableOpacity>
                    <Text style={pageStyles.formHeader}>Verification Request</Text>
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
        close_deposit_acc_details_card()
        close_bank_card()
        is_chartup_card_displayed = false
    }

    const callValidationFunc = async pin => {
        Alert.alert(
            '',
            'Activating Account...',
            [] //removes default ok button
        )
        await validatePayment(pin, errorHandler, () => Alert.alert('Account Successfully Activated','You Can Now Enjoy The Full Features Of This App!'))
    }

    return (
        <SafeAreaView style={[styles.container]}>
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
                <Text style={pageStyles.cardText}>Pay With Card: ???1,500</Text>
            </TouchableOpacity>

            
            <TouchableOpacity onPressIn={dispaly_Bank_Form} style={pageStyles.cardArea}>
                <Text style={pageStyles.cardText}>Bank Transfer: ???1,500</Text>
            </TouchableOpacity>

            <View  style={[pageStyles.cardArea, {borderRadius: 0, backgroundColor: '#fff'}]}>
                <TextInput onChangeText={val => {
                    pinRef.current.pin = val.toUpperCase()

                    pinRef.current.pin.length === 15? callValidationFunc(pinRef.current.pin): 'Pin Incomplete!'
                }} placeholder={'Input Purchased Pin If You Have One?'} placeholderTextColor={colors.appColor} style={[pageStyles.cardText, {color: colors.appColor}]}/>
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
                            callValidationFunc()
                        }}
                        ref={paystackWebViewRef}
                    />
                </View>
            </View>
            <StatusBar style="light"/>
        </SafeAreaView>
    )
    
}