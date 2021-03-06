import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    Text,
    Linking,
    View,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Alert,
    Share,
    BackHandler,
    ScrollView,
} from 'react-native';

import styles from '../styles/master.js';
import pageStyles from '../styles/settingsStyle.js';

let isLoginCardDisplayed = false
let isCard_displayed = false
let is_profile_card_displayed = false

export default function Settings({navigation}) {
    function openMenu () {
        navigation.openDrawer();
    }

    const [logInCard, setlogInCard] = useState()
    const [profileCard, setprofileCard] = useState()
    const [message, setmessage] = useState()

    BackHandler.addEventListener('hardwareBackPress', function () {
        if (!isCard_displayed) { //if a card is not beeing displayed and the main screen isnt in focus
            return false
        } else { //close all cards
            setlogInCard()
            setmessage()
            setprofileCard()
            is_profile_card_displayed = false
            isCard_displayed = false
            isLoginCardDisplayed = false
            return true;
        }
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCont}>
                <Text style={styles.baseText}>SETTINGS</Text>
                <TouchableOpacity style={styles.menuIcon} onPress={openMenu}>
                    <Image source={require('../icons/menuIcon.png')}/>
                </TouchableOpacity>
            </View>
            <ScrollView style={pageStyles.tableOfContents}>
                <TouchableOpacity style={pageStyles.content}>
                    <Image style={pageStyles.contentIcons} resizeMode={'center'} source={require('../icons/editProfile.png')}/>
                    <Text style={pageStyles.contentText} onPress={()=> {Alert.alert(
                        'To Edit Your Profile Contact Our Admin On WhatsApp',
                        '',
                        [
                            {
                                text: 'Contact',
                                onPress: ()=> {Linking.openURL(`https://wa.me/+2348067124123?text=Good%20Day%20Admin%20I%20contacted%20you%20from%20JUPEB%20STUDY%20APP \n I%20want%20to%20change%20my%20details`)}
                            },

                            {
                                text: 'Cancel',
                            }
                        ]
                    )}}>EDIT PROFILE</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {Linking.openURL('http://play.google.com/store/apps/details?id=com.learnxtra.jupebstudyapp')}} style={pageStyles.content}>
                    <Image style={pageStyles.contentIcons} resizeMode={'center'} source={require('../icons/rateApp.png')}/>
                    <Text style={pageStyles.contentText}>RATE</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {Share.share({title: 'Download Url', message: 'Hey Check Out This Cool Jupeb App! \n http://play.google.com/store/apps/details?id=com.learnxtra.jupebstudyapp'})}} style={[pageStyles.content, {marginBottom: '40%'}]}>
                    <Image style={pageStyles.contentIcons} resizeMode={'center'} source={require('../icons/share.png')}/>
                    <Text style={pageStyles.contentText}>SHARE</Text>
                </TouchableOpacity>
            </ScrollView>
            {logInCard}
            {message}
            {profileCard}
            <StatusBar style="light"/>
        </SafeAreaView>

    )
    
}