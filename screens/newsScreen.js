import React, {useState, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from 'react-native-webview';
import PDFReader from 'rn-pdf-reader-js'
import {
    Text,
    View,
    FlatList, 
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    BackHandler,
    Linking,
    Alert,
} from 'react-native';

import styles from '../styles/master.js';
import pageStyles from '../styles/newsFeedStyles.js';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as firebase from 'firebase';
import * as network from 'expo-network';
import { Asset } from 'expo-asset';

require('firebase/firestore')
require('firebase/storage')
require('firebase/database')

const firebaseConfig = {
    apiKey: "AIzaSyDzkEuiLvUrNZYdU6blvHgVoHBf2tniZO0",
    authDomain: "jupebstudyapp.firebaseapp.com",
    projectId: "jupebstudyapp",
    storageBucket: "jupebstudyapp.appspot.com",
    messagingSenderId: "316815533405",
    appId: "1:316815533405:web:b0e02fdcf37e5c5cf8b4b4",
    measurementId: "G-XFLZXCNJ44"
};

let newsObtained = false
let getUpdatesCalled = false

const news = [
    {
        name: 'General Information',
        data: []
    },

    {
        name: 'Relevant Materials',
        data: []
    }, 

    {
        name: 'Classes And Exam Support',
        data: []
    }, 
]

let card_displayed = false
let token
export default function newsScreen({navigation}) {

    const is_token_obtained = useRef(false)

    if (!firebase.apps.length) { //if firebase hasnt been initialized
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore()

    const getUpdates = async () => {
        try {
            const networkStat = await network.getNetworkStateAsync()
            if (networkStat.isInternetReachable && !newsObtained && !card_displayed) { //if internet is reachable and new isn't updated and no card is displayed
                
                Alert.alert('','Updating News...', [])
                for (const info of news) {
                    info.data = [] //empty data array
                    try {
                        await db.collection(info.name).get().then((snapShot)=> {
                            snapShot.forEach(doc => {
                                info.data.push(doc.data())
                            });
                        })
                    } catch (err) { //this could happen because internet is reachable but user does not have data thus database will not be reachable
                        alert('we are having trouble reaching our server. Are you offline?')
                        console.error();
                    }
                }
                Alert.alert('', 'News Updated...')
                newsObtained = true
            }
        } catch (error) { //errors usually show up because there's no network (can not get network state)
            alert('we are having trouble reaching our server. Are you offline?')
            console.error()
        }
    }
            
    const callGetUpdates =() => {
        if (!getUpdatesCalled) { //this to prevent it from calling getUpdates multiple times when states are changing
            getUpdates()
            getUpdatesCalled = true
        }
    }

    const getToken = async () => {
        if (!is_token_obtained.current) {
            try {
                token = await AsyncStorage.getItem('vpa')
                if (token === 'true') {
                    return token
                } else{
                    DISPLAY_BLOCKED_FEATURE_CARD()
                    return false
                }
            } catch (err) {
                console.log(err);
            }
            is_token_obtained.current = true
        }
    }
    
    const is_BLOCKED_CARD_DISPLAYED = useRef(false)
    function DISPLAY_BLOCKED_FEATURE_CARD() {
        if (!is_BLOCKED_CARD_DISPLAYED.current) {
            setBLOCKED_FEATURE_CARD(
                <View style={[styles.BLOCKED_FEATURE_CARD, {top: '9%'}]}>
                    <Text style={styles.BLOCKED_FEATURE_CARD_TEXT}>
                        This Feature Is Only Available To Paid Users.
                        Head To The Payment Section To Make Payment.
                    </Text>
                </View>
            )
            is_BLOCKED_CARD_DISPLAYED.current = true
        }
    }
    

    BackHandler.addEventListener('hardwareBackPress', function () {
        if (!card_displayed || !navigation.isFocused()) { //if a card is not beeing displayed and the main screen isnt in focus
            return false
        } else {
            setaboutCard()
            setguideCard()
            setsyllabulsCard()
            setupdatesCard()
            setmatCard()
            setRESOURCES_CARD()
            set_class_And_Exam_Card()
            card_displayed = false
            return true;
        }
    });
    
    function openMenu () {
        navigation.openDrawer();
    }
    const [aboutCard, setaboutCard] = useState()
    const [guideCard, setguideCard] = useState()
    const [updatesCard, setupdatesCard] = useState()
    const [matCard, setmatCard] = useState()
    const [RESOURCES_CARD, setRESOURCES_CARD] = useState()
    const [class_And_Exam_Card, set_class_And_Exam_Card] = useState()
    const [BLOCKED_FEATURE_CARD, setBLOCKED_FEATURE_CARD] = useState()

    function displayAboutCard() {
        setaboutCard(
            <View style={pageStyles.card}>
                <Text style={pageStyles.header}>ABOUT JUPEB</Text>
                <ScrollView style={{height: hp('90%'), marginBottom: 50}}>
                    <ScrollView horizontal={true}>
                        <Text style={pageStyles.StaticInfo}>
                            The Joint Universities Preliminary Examinations Board                   {'\n'}
                            (JUPEB) is a national examinations body approved by                     {'\n'}
                            the Federal Government of Nigeria in December 2013.                     {'\n'}
                            It was formally established in April 2014 by a                          {'\n'}
                            consortium of ten (10) partnering universities                          {'\n'}
                            led by the University of Lagos.                                         {'\n'}
                            {'\n'}
                            The board has the responsibility of                                     {'\n'}
                            conducting common and standard examinations                             {'\n'}
                            for the candidates, who have been exposed to a                          {'\n'}
                            minimum of one-year approved courses in the different                   {'\n'}
                            Universities's Foundation and/or Diploma Programmes                     {'\n'}
                            and are seeking Direct Entry admissions into                            {'\n'}
                            University courses                                                      {'\n'}
                            at the 200 Level in Nigerian and partnering                             {'\n'}
                            foreign universities.                                                   {'\n'}
                            {'\n'}
                            The first of such examinations was conducted in                         {'\n'}
                            August 2014 and successful                                              {'\n'}
                            candidates were admitted into 200 Level by                              {'\n'}
                            JAMB based on                                                           {'\n'}
                            recommendations from the universities.                                  {'\n'}
                            With effect from 2015, JUPEB Examinations will                          {'\n'}
                            hold in June annually.                                                  {'\n'}
                            {'\n'}
                            Source Jupeb Official Site.                                             {'\n'}
                            <Text style={{color: 'blue'}} onPress={()=> {Linking.openURL('https://jupeb.edu.ng/about_us/about_jupeb')}}>
                                https://jupeb.edu.ng/about_us/about_jupeb
                            </Text>
                        </Text>
                    </ScrollView>
                </ScrollView>
            </View>
        )
        card_displayed = true
    }

    function displayGuideCard() {
        setguideCard(
            <View style={pageStyles.card}>
                <ScrollView style={{height: hp('90%'), marginBottom: 50}}>
                    <Text style={pageStyles.header}>ADMISSION REQUIRMENTS</Text>
                    <ScrollView horizontal={true}>
                        <Text style={pageStyles.StaticInfo}>
                            To obtain JUPEB registration form,                                       {'\n'}
                            candidates are expected to possess at least                              {'\n'}
                            five credit passes in their O/level results.                             {'\n'}
                            Applicants without credit pass in either English                         {'\n'}
                            language and Mathematics can also apply.                                 {'\n'}
                            However, they are expected to register for the                           {'\n'}
                            either of the two.                                                       {'\n'}
                            {'\n'}
                            Applicants with AWAITING RESULTS can also apply                          {'\n'}
                            but their O’level result must be available before                        {'\n'}
                            University admission as it will be required by their                     {'\n'}
                            preferred university.
                        </Text>
                    </ScrollView>

                    <Text style={pageStyles.header}>AFFILIATE UNIVERSITIES</Text>
                    <ScrollView horizontal={true}>
                        <Text style={[pageStyles.StaticInfo, {left: wp('5%')}]}>
                            Abia State University, Abia State. 
                            {'\n'}
                            Alex Ekwueme University, Ndufu-Alike, Ikwo, Ebonyi State.                       
                            {'\n'}
                            Caritas Universtiy, Enugu State. 
                            {'\n'}
                            Chukwuemeka Odumegwu Ojukwu University, Uli, Anambra State.                           {'\n'}     
                            Clifford University Owerrinta, Aba, Abia State. 
                            {'\n'}
                            Eastern Palm University, Ogboko, Imo State.                                 
                            {'\n'}
                            Ebonyi State University, Ebonyi State. 
                            {'\n'}
                            Enugu State University of Science and Technology, Enugu State.                          
                            {'\n'}
                            Evangel University, Akaeze, Ebonyi State. 
                            {'\n'}
                            Federal University of Technology, Owerri, Imo State.                                    
                            {'\n'}
                            Godfrey Okoye University, Enugu State. 
                            {'\n'}
                            Imo State University, Owerri, Imo State. 
                            {'\n'}
                            Nnamdi Azikiwe University, Awka, Anambra State. 
                            {'\n'}
                            Paul University, Awka, Anambra State. 
                            {'\n'}
                            Renaissance University, Ugbawka, Enugu State. 
                            {'\n'}
                            University of Nigeria, Nsukka, Enugu State.
                            {'\n'}
                            Babcock University, Ilishan, Ogun State.
                            {'\n'}
                            Federal University of Agriculture, Abeokuta, Ogun State.
                            {'\n'}
                            Federal University of Technology, Akure.
                            {'\n'}
                            Federal University, Oye-Ekiti, Ekiti State.
                            {'\n'}
                            Obafemi Awolowo University, Ile-Ife, Osun State.
                            {'\n'}
                            Redeemers University, Ede, Osun State.
                            {'\n'}
                            University of Lagos, Akoka, Lagos State.
                            {'\n'}
                            And a lot more.
                        </Text>
                    </ScrollView>

                    <Text style={pageStyles.header}>JUPEB CUT OFF MARKS</Text>
                    <ScrollView horizontal={true}>
                        <Text style={pageStyles.StaticInfo}>
                            1. JUPEB cut off marks points for any science,{'\n'}
                            paramedical, administrative course is 6 points and above{'\n'}
                            {'\n'}
                            2. For Medicine, students must have at least 12 points and{'\n'}
                            above to gain admission to study Medicine in Nigerian universities{'\n'}
                            that offer the course with JUPEB ( examination will still be{'\n'}
                            conducted for Medicine students after meeting the required point with JUPEB)               {'\n'}
                            (OAU requires nothing less than 13 points){'\n'}
                            {'\n'}
                            3. The JUPEB cut off marks for Engineering courses,{'\n'}
                            A/level Mathematics, Physics {'&'} Chemistry{'\n'}
                            for Industrial Chemistry is 8 points and above{'\n'}
                            {'\n'}
                            4. JUPEB cut off marks for Social Sciences/Administrative{'\n'}
                            Courses is a minimum 7 points and above{'\n'}
                            {'\n'}
                            5. Candidates must have at least 5 points for Religious{'\n'}
                            Studies, Languages, and most of the Courses in Arts Faculty{'\n'}
                            and Agriculture.{'\n'}
                            {'\n'}
                            6. The cut-off marks for Law in JUPEB is 13 points,{'\n'}
                            candidates must have a minimum of 13 points to be able{'\n'}
                            to gain admission with JUPEB into 200 level to study{'\n'}
                            Law in those universities that offer the course and{'\n'}
                            that accept JUPEB.{'\n'}
                            {'\n'}
                            Source: <Text style={{color: 'blue'}} onPress={()=> {Linking.openURL('https://myschoolgist.net')}}>https://myschoolgist.net</Text>
                        </Text>
                    </ScrollView>
                    
                </ScrollView>
            </View>
        )
        card_displayed = true
    }

    const [syllabulsCard, setsyllabulsCard] = useState()
    async function displaySyllabuls() {
        try {
            const networkStat = await network.getNetworkStateAsync()
            if (networkStat.isInternetReachable) {
                Alert.alert('','Loading Syllable...', [])
                setsyllabulsCard(
                    <View style={pageStyles.card}>
                        <Text style={pageStyles.header}>JUPEB SYLLABUS</Text>
                        <PDFReader webviewStyle={{backgroundColor: '#fff'}} withPinchZoom={true} customStyle={{
                            readerContainerDocument: {backgroundColor: '#fff'},
                            readerContainerZoomContainerButton: {display: 'none'},
                        }} style={{position: 'absolute', backgroundColor: '#fff', width: '100%', height: '90%', top: '10%'}}
                            source={{
                                uri: Asset.fromModule(require('../assets/sylabulls.pdf')).uri
                            }}
                        />
                    </View>,
                )
                Alert.alert('','Syllable Loaded...')
            }
        } catch (error) {
            console.log(error);
            Alert.alert('', 'Unable To Serve Resource \n Are You Offline?')
        }
        card_displayed = true
    }

    function displayupdatesCard() {
        if (!news[0].data.length) { //if there are no new info in this section //if there are no new info in this section
            setupdatesCard(
                <View style={pageStyles.card}>
                    <Text style={pageStyles.header}>GENERAL INFORMATION</Text>
                    <Image style={pageStyles.contentIcons} resizeMode={'center'} source={require('../icons/empty.png')}/>
                    <Text style={pageStyles.nullText}>
                        Nothing to see here yet.
                    </Text>
                    <Text style={pageStyles.nullText}>
                        Try Refreshing To See Updates!
                    </Text>
                </View>
            )
        } else {
                setupdatesCard(
                    <View style={pageStyles.card}>
                        <Text style={pageStyles.header}>GENERAL INFORMATION</Text>
                        <View style={{flex: 1}}>
                            <FlatList
                                data={news[0].data}
                                contentContainerStyle = {{paddingBottom: 200}}
                                renderItem={({item}) => (
                                    <View style={pageStyles.newsCont}>
                                        <Text style={pageStyles.topic}>{item.Topic}:</Text>
                                        <Text style={pageStyles.body}>{item.Body}</Text>
                                    </View>
                                )}
                                keyExtractor = {item => item.Topic}
                            />
                        </View>
                    </View>
                )

        }
        card_displayed = true
    }

    function displayMatCard() {
        getToken().then(() => {
            if (token === 'true') {
                if (!news[1].data.length) { //if there are no new info in this section
                    setmatCard(
                        <View style={pageStyles.card}>
                            <Image style={pageStyles.contentIcons} resizeMode={'center'} source={require('../icons/empty.png')}/>
                            <Text style={pageStyles.nullText}>
                                Nothing to see here yet.
                            </Text>
                            <Text style={pageStyles.nullText}>
                                Try Refreshing To See Updates!
                            </Text>
                        </View>
                    )
                } else {
                        setmatCard(
                            <View style={pageStyles.card}>
                                <Text style={pageStyles.header}>Relevant Materials</Text>
                                <View style={{flex: 1}}>
                                    <FlatList
                                        data={news[1].data}
                                        contentContainerStyle = {{paddingBottom: 200}}
                                        renderItem={({item}) => (
                                            <View style={pageStyles.newsCont}>
                                                <Text style={pageStyles.topic}>{item.Topic}:</Text>
                                                <Text style={pageStyles.body}>{item.Body}</Text>
                                            </View>
                                        )}
                                        keyExtractor = {item => item.Topic}
                                    />
                                </View>
                            </View>
                        )
        
                }
                card_displayed = true
            }
        })
    }

    function display_exam_and_classes_Card() {
        getToken().then(() => {
            if (token === 'true') {
                if (!news[2].data.length) { //if there are no new info in this section
                    set_class_And_Exam_Card(
                        <View style={pageStyles.card}>
                            <Image style={pageStyles.contentIcons} resizeMode={'center'} source={require('../icons/empty.png')}/>
                            <Text style={pageStyles.nullText}>
                                Nothing to see here yet.
                            </Text>
                            <Text style={pageStyles.nullText}>
                                Try Refreshing To See Updates!
                            </Text>
                        </View>
                    )
                } else {
                    set_class_And_Exam_Card(
                        <View style={pageStyles.card}>
                            <Text style={pageStyles.header}>CLASSES AND EXAM UPDATES</Text>
                            <View style={{flex: 1}}>
                                <FlatList
                                    data={news[2].data}
                                    contentContainerStyle = {{paddingBottom: 200}}
                                    renderItem={({item}) => (
                                        <View style={pageStyles.newsCont}>
                                            <Text style={pageStyles.topic}>{item.Topic}</Text>
                                            <Text style={pageStyles.body}>{item.Body}</Text>
                                        </View>
                                    )}
                                    keyExtractor = {item => item.Topic}
                                />
                            </View>
                        </View>
                    )
        
                }
                card_displayed = true
            }
        })
    }

    async function display_resources_card() {
        getToken().then(() => {
          if (token === 'true') {
              setRESOURCES_CARD(
                  <View style={pageStyles.card}>
                      <ScrollView style={{height: hp('100%'), marginBottom: 50}}>
                          <Text style={[pageStyles.header]}>PERIODIC TABLE OF ELEMENTS</Text>
                          <ScrollView style={{position: 'relative', top: hp('10%'), marginBottom: hp('15%') }} horizontal={true}>
                              <Image style={{left: wp('5%')}} source={require('../icons/periodicTable.png')}/>
                          </ScrollView>
      
                          <Text style={[pageStyles.header, {marginTop: hp('6%')}]}>COMMON FUNCTIONAL GROUPS</Text>
                          <ScrollView style={{position: 'relative', top: hp('10%'), marginBottom: hp('15%') }} horizontal={true}>
                              <Image style={{left: wp('5%')}} source={require('../icons/commonFuncGroups.png')}/>
                          </ScrollView>
      
                          <Text style={[pageStyles.header, {marginTop: hp('6%')}]}>TABLE OF STANDARD INTEGRALS</Text>
                          <ScrollView style={{position: 'relative', top: hp('10%'), marginBottom: hp('15%') }} horizontal={true}>
                              <Image style={{left: wp('5%')}} source={require('../icons/integral.png')}/>
                          </ScrollView>
      
                          <Text style={[pageStyles.header, {marginTop: hp('6%')}]}>TABLE OF STANDARD DERIVATIVES</Text>
                          <ScrollView style={{position: 'relative', top: hp('10%'), marginBottom: hp('15%') }} horizontal={true}>
                              <Image source={require('../icons/derivativesTable.png')}/>
                          </ScrollView>
      
                          <Text style={[pageStyles.header, {marginTop: hp('6%')}]}>BINOMIAL DISTRIBUTION TABLE</Text>
                          <ScrollView style={{position: 'relative', top: hp('10%'), marginBottom: hp('15%') }} horizontal={true}>
                              <Image source={require('../icons/binomialDist.png')}/>
                          </ScrollView>
      
                          <Text style={[pageStyles.header, {marginTop: hp('6%')}]}>PHYSICS CONSTANTS</Text>
                          <ScrollView style={{position: 'relative', top: hp('10%'), marginBottom: hp('15%') }} horizontal={true}>
                              <Image source={require('../icons/phyConst.png')}/>
                          </ScrollView>
      
                      </ScrollView>
                  </View>
              )
              card_displayed = true
          }
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCont}>
                <Text style={styles.baseText}>NEWS {'&'} RESOURCES</Text>
                <TouchableOpacity style={styles.menuIcon} onPress={openMenu}>
                    <Image source={require('../icons/menuIcon.png')}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress = {() => {
                newsObtained = false
                getUpdates()
            }} style={pageStyles.refreshButn}>
                <Text style={pageStyles.refreshButnText}>Refresh</Text>
            </TouchableOpacity>
            <ScrollView style={pageStyles.tableOfContents}>
                <TouchableOpacity style={pageStyles.content} onPress={displayAboutCard}>
                    <Image resizeMode={'center'} style={pageStyles.contentIcons} style={pageStyles.contentIcons} source={require('../icons/about.png')}/>
                    <Text style={pageStyles.contentText}>ABOUT JUPEB</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.content} onPress={displayGuideCard}>
                    <Image resizeMode={'center'} style={pageStyles.contentIcons} source={require('../icons/guide.png')}/>
                    <Text style={pageStyles.contentText}>PROGRAMME GUIDE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.content} onPress={displaySyllabuls}>
                    <Image resizeMode={'center'} style={pageStyles.contentIcons} source={require('../icons/syllables.png')}/>
                    <Text style={pageStyles.contentText}>JUPEB SYLLABUS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.content} onPress={displayupdatesCard}>
                    <Image resizeMode={'center'} style={pageStyles.contentIcons} source={require('../icons/updates.png')}/>
                    <Text style={pageStyles.contentText}>GENERAL INFORMATION</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.content} onPress={display_exam_and_classes_Card}>
                    <Image resizeMode={'center'} style={pageStyles.contentIcons} source={require('../icons/classes.png')}/>
                    <Text style={pageStyles.contentText}>CLASSES AND EXAM UPDATES</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.content} onPress={displayMatCard}>
                    <Image resizeMode={'center'} style={pageStyles.contentIcons} source={require('../icons/materials.png')}/>
                    <Text style={pageStyles.contentText}>MATERIALS FOR STUDY</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.content} onPress={display_resources_card}>
                    <Image resizeMode={'center'} style={pageStyles.contentIcons} source={require('../icons/resources.png')}/>
                    <Text style={pageStyles.contentText}>RESOURCES</Text>
                </TouchableOpacity>
                <View style={{height: '20%', marginTop: '20%'}}></View>
            </ScrollView>
            {aboutCard}
            {guideCard}
            {syllabulsCard}
            {updatesCard}
            {matCard}
            {class_And_Exam_Card}
            {RESOURCES_CARD}
            {callGetUpdates()}
            {BLOCKED_FEATURE_CARD}
            <StatusBar style="light" />
        </SafeAreaView>

    )
}