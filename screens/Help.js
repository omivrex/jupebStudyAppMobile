import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {Text, View, ScrollView, TouchableOpacity, SafeAreaView, Image, Linking} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import styles from '../styles/master.js';
import pageStyles from '../styles/helpStyles.js';
import { Platform } from 'react-native-web';

export default function Help({navigation}) {
    function openMenu () {
        navigation.openDrawer();
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCont}>
                <Text style={styles.baseText}>HELP</Text>
                <TouchableOpacity style={styles.menuIcon} onPress={openMenu}>
                    {Platform.OS!== 'web'?<Image source={require('../icons/menuIcon.png')}/>: <img width={100} src={require('../icons/menuIcon.png')}/>}
                </TouchableOpacity>
            </View>
            <View style={pageStyles.card}>
                <ScrollView style={{height: hp('90%'), marginBottom: 50}}>
                    <Text style={pageStyles.header}>CONTACT</Text>
                    <ScrollView horizontal={true}>
                        <Text style={[pageStyles.StaticInfo, {left: wp('5%')}]}>
                            For complains, enquires and questions.                   {'\n'}
                            Contact Our Admin on WhatsApp: {'\n'}
                            {'\n'}
                            <Text>
                               HOLGET:  <Text onPress={() => {Linking.openURL(`https://wa.me/+2348067124123?text=Good%20Day%20Admin%20I%20contacted%20you%20from%20JUPEB%20STUDY%20APP`)}} style={{textDecorationLine: 'underline', color: '#8479ff'}}>+234 806 712 4123</Text>
                            </Text>
                            {'\n'}
                            {'\n'}
                            <Text>
                                KYLE: <Text onPress={() => {Linking.openURL(`https://wa.me/+2348067340115?text=Good%20Day%20Admin%20I%20contacted%20you%20from%20JUPEB%20STUDY%20APP`)}} style={{textDecorationLine: 'underline', color: '#8479ff'}}>+234 806 734 0115</Text>
                            </Text>
                        </Text>
                    </ScrollView>
                    <Text style={pageStyles.header}>PAST QUESTIONS</Text>
                    <ScrollView horizontal={true}>
                        <Text style={pageStyles.StaticInfo}>
                            This application contains past question on{'\n'}
                            MTH, PHY, CHM and BIO. And just a click to view the {'\n'}
                            corresponding detailed solution. {'\n'}
                            {'\n'}
                            Each course was splitted into four sections.{'\n'}
                            (001-004) as to enable our user learn in a {'\n'}
                            better arrangement.{'\n'}
                            Note: only our paid users can gain complete {'\n'}
                            access to the four courses.{'\n'}
                        </Text>
                    </ScrollView>

                    <Text style={pageStyles.header}>NEWS {'&'} RESOURCES</Text>
                    <ScrollView horizontal={true}>
                        <Text style={[pageStyles.StaticInfo, {left: wp('5%')}]}>
                            We keep you updated with recent {'\n'}
                            happening concerning the program. {'\n'}
                            {'\n'}
                            We update you with recommended {'\n'}
                            study materials and cut off marks {'\n'}
                            for different Universities.                        {'\n'}
                        </Text>
                    </ScrollView>

                    <Text style={pageStyles.header}>START PRACTICE</Text>
                    <ScrollView horizontal={true}>
                        <Text style={pageStyles.StaticInfo}>
                            You can take a test to know how you progress                {'\n'}
                            after your study with the past questions                    {'\n'}
                            section.                    {'\n'}
                            {'\n'}
                            This test can either be timed or not,                       {'\n'}
                            by default the timer is off you can turn this                  {'\n'}
                            timer on by clicking on the timmer button.                  {'\n'}
                            Also the time is set to 1 hour by default but                   {'\n'}
                            you can select other options by clicking the                    {'\n'}
                            select time button.                                 {'\n'}
                            {'\n'}
                            On submittion your test in marked and                      {'\n'}
                            your score is shown. This progress is then                          {'\n'}
                            logged to the rate progress section.                        {'\n'}
                        </Text>
                    </ScrollView>

                    <Text style={pageStyles.header}>RATE PROGRESS</Text>
                    <ScrollView horizontal={true}>
                        <Text style={pageStyles.StaticInfo}>
                            Your progress is calculated using the scores                                        {'\n'}
                            and time spent from each test.                                      {'\n'}
                            {'\n'}
                            Your course strength is the total score                                         {'\n'}
                            obtained from all tests taken so far.                                        {'\n'}
                            {'\n'}
                            Average Time Taken is the time                                       {'\n'}
                            taken for you to complete all tests taken                                        {'\n'}
                            in that subject so far.                                     {'\n'}
                            {'\n'}
                            Average Time spent is the                                       {'\n'}
                            time spent per question, that is the time                                        {'\n'}
                            you spend answering each question.                                     {'\n'}
                            This is important to enhance your speed                                         {'\n'}
                            in answering questions and finishing your                                       {'\n'}
                            main exams on time.                                      {'\n'}
                            {'\n'}
                            Each log can be reset by                                       {'\n'}
                            clicking on the reset button below each                                         {'\n'}
                            course section.                                         {'\n'}
                            {'\n'}
                            After you take a new test click the                                         {'\n'}
                            refresh button to see your new progress.                                        {'\n'}
                        </Text>
                    </ScrollView>
                </ScrollView>
            </View>
            <StatusBar style="light" />
        </SafeAreaView>

    )
    
}