import React, {useState, useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import PDFReader from 'rn-pdf-reader-js'
import {
    Text,
    View,
    FlatList, 
    TouchableHighlight,
    SafeAreaView,
    ScrollView,
    Image,
    BackHandler,
    Alert,
} from 'react-native';

import styles from '../styles/master.js';
import pageStyles from '../styles/newsFeedStyles.js';

import LoadingComponent from "../components/loading.component"
import { getSectionData, getToken } from "../utils/news.utils";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import * as network from 'expo-network';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native-web';

let newsObtained = false

let card_displayed = false
export default function newsScreen({navigation}) {
    const [loading, setloading] = useState()
    // useEffect(() => {
    //   getUpdates()
    // }, [])

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
            setmatCard()
            setRESOURCES_CARD()
            card_displayed = false
            return true;
        }
    });
    
    function openMenu () {
        navigation.openDrawer();
    }
    const [aboutCard, setaboutCard] = useState()
    const [guideCard, setguideCard] = useState()
    const [matCard, setmatCard] = useState()
    const [lectureNotesCard, setlectureNotesCard] = useState()
    const [RESOURCES_CARD, setRESOURCES_CARD] = useState()
    const [BLOCKED_FEATURE_CARD, setBLOCKED_FEATURE_CARD] = useState()

    function displayAboutCard() {
        setaboutCard(
            <View style={pageStyles.card}>
                {Platform.OS !== 'web'?
                    <WebView 
                        originWhitelist={['*']}
                        source={{
                            html: `
                                <head>
                                    <meta name="viewport"  content="width=device-width, initial-scale=1.0 maximum-scale=1.0">
                                </head>
                                <body>
                                    <div style="
                                        font-size: 1em;
                                        font-family: Roboto, sans-serif, san Francisco;
                                        margin: auto;
                                        min-height: 50rem;
                                    ">
                                        <h1 style="text-align: center; overflow-y: auto;">ABOUT JUPEB</h1>
                                        <p>
                                            The Joint Universities Preliminary Examinations Board
                                            (JUPEB) is a national examinations body approved by  
                                            the Federal Government of Nigeria in December 2013.  
                                            It was formally established in April 2014 by a       
                                            consortium of ten (10) partnering universities       
                                            led by the University of Lagos.   
                                        </p>
                                        <p>
                                            The board has the responsibility of                  
                                            conducting common and standard examinations          
                                            for the candidates, who have been exposed to a       
                                            minimum of one-year approved courses in the different
                                            Universities's Foundation and/or Diploma Programmes  
                                            and are seeking Direct Entry admissions into         
                                            University courses                                   
                                            at the 200 Level in Nigerian and partnering          
                                            foreign universities.   
                                        </p>
                                        <p>
                                            The first of such examinations was conducted in
                                            August 2014 and successful                     
                                            candidates were admitted into 200 Level by     
                                            JAMB based on                                  
                                            recommendations from the universities.         
                                            With effect from 2015, JUPEB Examinations will 
                                            hold in June annually.                         
                                            
                                            Source Jupeb Official Site.
                                            <a href="https://jupeb.edu.ng/about_us/about_jupeb">https://jupeb.edu.ng/about_us/about_jupeb</a>
                                        </p>
                                    </div>
                                    <div style="height: 50%"></div>
                                </body>
                            `
                        }}
                    />
                    :
                    <div style={{
                        fontSize: '1em',
                        fontFamily: 'Roboto, sans-serif, san Francisco',
                        margin: 'auto',
                        minHeight: '50rem',
                    }}>
                        <h1 style={{textAlign: 'center', overflowY: 'auto'}}>ABOUT JUPEB</h1>
                        <p>
                            The Joint Universities Preliminary Examinations Board
                            (JUPEB) is a national examinations body approved by  
                            the Federal Government of Nigeria in December 2013.  
                            It was formally established in April 2014 by a       
                            consortium of ten (10) partnering universities       
                            led by the University of Lagos.   
                        </p>
                        <p>
                            The board has the responsibility of                  
                            conducting common and standard examinations          
                            for the candidates, who have been exposed to a       
                            minimum of one-year approved courses in the different
                            Universities's Foundation and/or Diploma Programmes  
                            and are seeking Direct Entry admissions into         
                            University courses                                   
                            at the 200 Level in Nigerian and partnering          
                            foreign universities.   
                        </p>
                        <p>
                            The first of such examinations was conducted in
                            August 2014 and successful                     
                            candidates were admitted into 200 Level by     
                            JAMB based on                                  
                            recommendations from the universities.         
                            With effect from 2015, JUPEB Examinations will 
                            hold in June annually.                         
                            
                            Source Jupeb Official Site.
                            <a href="https://jupeb.edu.ng/about_us/about_jupeb">https://jupeb.edu.ng/about_us/about_jupeb</a>
                        </p>
                    </div>
                }
            </View>
        )
        card_displayed = true
    }

    function displayGuideCard() {
        setguideCard(
            <View style={pageStyles.card}>
                {Platform.OS !== 'web'?
                
                <WebView 
                    originWhitelist={['*']}
                    source={{
                        html: `
                            <head>
                                <meta name="viewport"  content="width=device-width, initial-scale=1.0 maximum-scale=1.0">
                            </head>
                            <body style="overflow-y: auto;">
                                <div style="
                                    font-size: 1em;
                                    font-family: Roboto, sans-serif, san Francisco;
                                    width: 90%;
                                    margin: auto;
                                    min-height: 50rem;
                                    margin-bottom: 2rem;
                                ">
                                    <h1 style="text-align: center;">ADMISSION REQUIRMENTS</h1>
                                    <p>
                                        To obtain JUPEB registration form,                                       
                                        candidates are expected to possess at least                              
                                        five credit passes in their O/level results.                             
                                        Applicants without credit pass in either English                         
                                        language and Mathematics can also apply.                                 
                                        However, they are expected to register for the                           
                                        either of the two.                                                       
                                        
                                        Applicants with AWAITING RESULTS can also apply                          
                                        but their O’level result must be available before                        
                                        University admission as it will be required by their                     
                                        preferred university.
                                    </p>

                                    <h1 style="text-align: center;">AFFILIATE UNIVERSITIES</h1>
                                    <p>
                                        Abia State University, Abia State. 
                                        <br/>
                                        Alex Ekwueme University, Ndufu-Alike, Ikwo, Ebonyi State.                       
                                        <br/>
                                        Caritas Universtiy, Enugu State. 
                                        <br/>
                                        Chukwuemeka Odumegwu Ojukwu University, Uli, Anambra State. 
                                        Clifford University Owerrinta, Aba, Abia State. 
                                        <br/>
                                        Eastern Palm University, Ogboko, Imo State.                                 
                                        <br/>
                                        Ebonyi State University, Ebonyi State. 
                                        <br/>
                                        Enugu State University of Science and Technology, Enugu State.                          
                                        <br/>
                                        Evangel University, Akaeze, Ebonyi State. 
                                        <br/>
                                        Federal University of Technology, Owerri, Imo State.                                    
                                        <br/>
                                        Godfrey Okoye University, Enugu State. 
                                        <br/>
                                        Imo State University, Owerri, Imo State. 
                                        <br/>
                                        Nnamdi Azikiwe University, Awka, Anambra State. 
                                        <br/>
                                        Paul University, Awka, Anambra State. 
                                        <br/>
                                        Renaissance University, Ugbawka, Enugu State. 
                                        <br/>
                                        University of Nigeria, Nsukka, Enugu State.
                                        <br/>
                                        Babcock University, Ilishan, Ogun State.
                                        <br/>
                                        Federal University of Agriculture, Abeokuta, Ogun State.
                                        <br/>
                                        Federal University of Technology, Akure.
                                        <br/>
                                        Federal University, Oye-Ekiti, Ekiti State.
                                        <br/>
                                        Obafemi Awolowo University, Ile-Ife, Osun State.
                                        <br/>
                                        Redeemers University, Ede, Osun State.
                                        <br/>
                                        University of Lagos, Akoka, Lagos State.
                                        <br/>
                                        And a lot more.
                                    </p>

                                    <h1 style="text-align: center;">JUPEB CUT OFF MARKS</h1>
                                    <p>
                                        1. JUPEB cut off marks points for any science,
                                        paramedical, administrative course is 6 points and above
                                        <br/>
                                        2. For Medicine, students must have at least 12 points and
                                        above to gain admission to study Medicine in Nigerian universities
                                        that offer the course with JUPEB ( examination will still be
                                        conducted for Medicine students after meeting the required point with JUPEB)               
                                        (OAU requires nothing less than 13 points)
                                        <br/>
                                        3. The JUPEB cut off marks for Engineering courses,
                                        A/level Mathematics, Physics {'&'} Chemistry
                                        for Industrial Chemistry is 8 points and above
                                        <br/>
                                        4. JUPEB cut off marks for Social Sciences/Administrative
                                        Courses is a minimum 7 points and above.
                                        <br/>
                                        5. Candidates must have at least 5 points for Religious
                                        Studies, Languages, and most of the Courses in Arts Faculty
                                        and Agriculture.
                                        <br/>
                                        6. The cut-off marks for Law in JUPEB is 13 points,
                                        candidates must have a minimum of 13 points to be able
                                        to gain admission with JUPEB into 200 level to study
                                        Law in those universities that offer the course and
                                        that accept JUPEB.
                                        <br/>
                                        Source: <a href='https://myschoolgist.net'>https://myschoolgist.net</a>
                                    </p>
                                </div>
                                <div style="height: 50%"></div>
                            </body>
                        `
                    }}
                />
                :
                <>
                    <div style={{
                        fontSize: '1em',
                        fontFamily: 'Roboto, sans-serif, san Francisco',
                        width: '90%',
                        margin: 'auto',
                        height: '100vh',
                        overflow: 'auto',
                        marginBottom: '2rem',
                    }}>
                        <h1 style={{textAlign: 'center'}}>ADMISSION REQUIRMENTS</h1>
                        <p>
                            To obtain JUPEB registration form,                                       
                            candidates are expected to possess at least                              
                            five credit passes in their O/level results.                             
                            Applicants without credit pass in either English                         
                            language and Mathematics can also apply.                                 
                            However, they are expected to register for the                           
                            either of the two.                                                       
                            
                            Applicants with AWAITING RESULTS can also apply                          
                            but their O’level result must be available before                        
                            University admission as it will be required by their                     
                            preferred university.
                        </p>

                        <h1 style={{textAlign: 'center'}}>AFFILIATE UNIVERSITIES</h1>
                        <p>
                            Abia State University, Abia State. 
                            <br/>
                            Alex Ekwueme University, Ndufu-Alike, Ikwo, Ebonyi State.                       
                            <br/>
                            Caritas Universtiy, Enugu State. 
                            <br/>
                            Chukwuemeka Odumegwu Ojukwu University, Uli, Anambra State. 
                            Clifford University Owerrinta, Aba, Abia State. 
                            <br/>
                            Eastern Palm University, Ogboko, Imo State.                                 
                            <br/>
                            Ebonyi State University, Ebonyi State. 
                            <br/>
                            Enugu State University of Science and Technology, Enugu State.                          
                            <br/>
                            Evangel University, Akaeze, Ebonyi State. 
                            <br/>
                            Federal University of Technology, Owerri, Imo State.                                    
                            <br/>
                            Godfrey Okoye University, Enugu State. 
                            <br/>
                            Imo State University, Owerri, Imo State. 
                            <br/>
                            Nnamdi Azikiwe University, Awka, Anambra State. 
                            <br/>
                            Paul University, Awka, Anambra State. 
                            <br/>
                            Renaissance University, Ugbawka, Enugu State. 
                            <br/>
                            University of Nigeria, Nsukka, Enugu State.
                            <br/>
                            Babcock University, Ilishan, Ogun State.
                            <br/>
                            Federal University of Agriculture, Abeokuta, Ogun State.
                            <br/>
                            Federal University of Technology, Akure.
                            <br/>
                            Federal University, Oye-Ekiti, Ekiti State.
                            <br/>
                            Obafemi Awolowo University, Ile-Ife, Osun State.
                            <br/>
                            Redeemers University, Ede, Osun State.
                            <br/>
                            University of Lagos, Akoka, Lagos State.
                            <br/>
                            And a lot more.
                        </p>

                        <h1 style={{textAlign: 'center'}}>JUPEB CUT OFF MARKS</h1>
                        <p>
                            1. JUPEB cut off marks points for any science,
                            paramedical, administrative course is 6 points and above
                            <br/>
                            2. For Medicine, students must have at least 12 points and
                            above to gain admission to study Medicine in Nigerian universities
                            that offer the course with JUPEB ( examination will still be
                            conducted for Medicine students after meeting the required point with JUPEB)               
                            (OAU requires nothing less than 13 points)
                            <br/>
                            3. The JUPEB cut off marks for Engineering courses,
                            A/level Mathematics, Physics {'&'} Chemistry
                            for Industrial Chemistry is 8 points and above
                            <br/>
                            4. JUPEB cut off marks for Social Sciences/Administrative
                            Courses is a minimum 7 points and above.
                            <br/>
                            5. Candidates must have at least 5 points for Religious
                            Studies, Languages, and most of the Courses in Arts Faculty
                            and Agriculture.
                            <br/>
                            6. The cut-off marks for Law in JUPEB is 13 points,
                            candidates must have a minimum of 13 points to be able
                            to gain admission with JUPEB into 200 level to study
                            Law in those universities that offer the course and
                            that accept JUPEB.
                            <br/>
                            Source: <a href='https://myschoolgist.net'>https://myschoolgist.net</a>
                        </p>
                    </div>
                </>
            }
            </View>
        )
        card_displayed = true
    }

    const [syllabulsCard, setsyllabulsCard] = useState()
    async function displaySyllabuls() {
        try {
            const networkStat = await network.getNetworkStateAsync()
            if (Platform.OS !== 'web') {
                if (networkStat.isInternetReachable) {
                    setloading(
                        <View style={{width: wp('100%'), height: hp('100%'), top: hp('15%'), position: 'absolute'}}>
                            <LoadingComponent />
                        </View>
                    )
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
                    setTimeout(() => {
                        setloading()
                    }, 1500);
                }
            }
        } catch (error) {
            console.log(error);
            Alert.alert('', 'Unable To Serve Resource \n Are You Offline?', [{text: 'Ok', onPress: () => ''}], {cancelable: true})
        }
        card_displayed = true
    }

    const livePastQuestions = [
        require('../icons/lvPq_1.jpg'),
        require('../icons/lvPq_2.jpg'),
        require('../icons/lvPq_3.jpg'),
        require('../icons/lvPq_4.jpg'),
        require('../icons/lvPq_5.jpg'),
        require('../icons/lvPq_6.jpg'),
        require('../icons/lvPq_7.jpg'),
        require('../icons/lvPq_8.jpg'),
        require('../icons/lvPq_9.jpg'),
        require('../icons/lvPq_10.jpg'),
        require('../icons/lvPq_11.jpg'),
        require('../icons/lvPq_12.jpg'),
    ]

    function displayMatCard() {
        getToken(DISPLAY_BLOCKED_FEATURE_CARD).then(token => {
            if (token === 'true') {
                setmatCard(
                    <View style={pageStyles.card}>
                        <Text style={pageStyles.header}>LIVE PAST QUESTIONS</Text>
                        <View style={{flex: 1}}>
                            <FlatList
                                data={livePastQuestions}
                                contentContainerStyle = {{paddingBottom: 200}}
                                renderItem={({item}) => Platform.OS !== 'web'?(
                                    <Image resizeMode={'contain'} style={{width: wp('100%'), marginTop: hp('0%')}} source={item}/>
                                ): (<img style={{width: wp('100%'), marginTop: hp('0%')}} src={item}/>)}
                                keyExtractor = {(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                )
                card_displayed = true
            }
        })
    }

    async function display_resources_card() {
        getToken(DISPLAY_BLOCKED_FEATURE_CARD).then(token => {
            if (token === 'true') {
              setRESOURCES_CARD(
                  <View style={pageStyles.card}>
                      <ScrollView style={{height: hp('100%'), marginBottom: 50}}>
                          <Text style={[pageStyles.header, {marginTop: hp('6%')}]}>COMMON FUNCTIONAL GROUPS</Text>
                          <ScrollView style={{position: 'relative', top: hp('10%'), marginBottom: hp('15%') }} horizontal={true}>
                              {Platform.OS !== 'web'? <Image style={{left: wp('5%')}} source={require('../icons/commonFuncGroups.png')}/>: <img src={require('../icons/commonFuncGroups.png')} style={{left: wp('5%')}} />}
                          </ScrollView>
      
                          <Text style={[pageStyles.header, {marginTop: hp('6%')}]}>TABLE OF STANDARD INTEGRALS</Text>
                          <ScrollView style={{position: 'relative', top: hp('10%'), marginBottom: hp('15%') }} horizontal={true}>
                              {Platform.OS !== 'web'? <Image style={{left: wp('5%')}} source={require('../icons/integral.png')}/>: <img src={require('../icons/integral.png')} style={{left: wp('5%')}} />}
                          </ScrollView>
      
                          <Text style={[pageStyles.header, {marginTop: hp('6%')}]}>TABLE OF STANDARD DERIVATIVES</Text>
                          <ScrollView style={{position: 'relative', top: hp('10%'), marginBottom: hp('15%') }} horizontal={true}>
                              {Platform.OS !== 'web'? <Image source={require('../icons/derivativesTable.png')}/>: <img src={require('../icons/derivativesTable.png')}/>}
                          </ScrollView>
      
                          <Text style={[pageStyles.header, {marginTop: hp('6%')}]}>BINOMIAL DISTRIBUTION TABLE</Text>
                          <ScrollView style={{position: 'relative', top: hp('10%'), marginBottom: hp('15%') }} horizontal={true}>
                              {Platform.OS !== 'web'? <Image source={require('../icons/binomialDist.png')}/>: <img src={require('../icons/binomialDist.png')}/>}
                          </ScrollView>
      
                          <Text style={[pageStyles.header, {marginTop: hp('6%')}]}>PHYSICS CONSTANTS</Text>
                          <ScrollView style={{position: 'relative', top: hp('10%'), marginBottom: hp('15%') }} horizontal={true}>
                              {Platform.OS !== 'web'? <Image source={require('../icons/phyConst.png')}/>: <img src={require('../icons/phyConst.png')}/>}
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
                <TouchableHighlight underlayColor='rgba(156, 39, 176,1)' style={styles.menuIcon} onPress={openMenu}>
                {Platform.OS!== 'web'?<Image source={require('../icons/menuIcon.png')}/>: <img width={100} src={require('../icons/menuIcon.png')}/>}
                </TouchableHighlight>
            </View>
            <View style={pageStyles.tableOfContents}>
                <TouchableHighlight underlayColor='rgba(156, 39, 176,1)' style={pageStyles.content} onPress={displayAboutCard}>
                    <View>
                        {Platform.OS !=='web'?<Image resizeMode={'center'} style={pageStyles.contentIcons} source={require('../icons/about.png')}/>: <img width={30} height={30} style={{margin:'auto'}} src={require('../icons/about.png')}/>}
                        <Text style={pageStyles.contentText}>ABOUT JUPEB</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor='rgba(156, 39, 176,1)' style={pageStyles.content} onPress={displayGuideCard}>
                    <View>
                        {Platform.OS !=='web'?<Image resizeMode={'center'} style={pageStyles.contentIcons} source={require('../icons/guide.png')}/>: <img width={30} height={30} style={{margin:'auto'}} src={require('../icons/guide.png')}/>}
                        <Text style={pageStyles.contentText}>PROGRAMME GUIDE</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor='rgba(156, 39, 176,1)' style={pageStyles.content} onPress={displaySyllabuls}>
                    <View>
                        {Platform.OS !=='web'?<Image resizeMode={'center'} style={pageStyles.contentIcons} source={require('../icons/syllables.png')}/>: <img width={30} height={30} style={{margin:'auto'}} src={require('../icons/syllables.png')}/>}
                        <Text style={pageStyles.contentText}>JUPEB SYLLABUS</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor='rgba(156, 39, 176,1)' style={pageStyles.content} onPress={displayMatCard}>
                    <View>
                        {Platform.OS !=='web'?<Image resizeMode={'center'} style={pageStyles.contentIcons} source={require('../icons/materials.png')}/>: <img width={30} height={30} style={{margin:'auto'}} src={require('../icons/materials.png')}/>}
                        <Text style={pageStyles.contentText}>MATERIALS FOR STUDY</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor='rgba(156, 39, 176,1)' style={[pageStyles.content, {width: '90%', left: '1%', top: '0%'}]} onPress={display_resources_card}>
                    <View>
                        {Platform.OS !=='web'?<Image resizeMode={'center'} style={pageStyles.contentIcons} source={require('../icons/resources.png')}/>: <img width={30} height={30} style={{margin:'auto'}} src={require('../icons/resources.png')}/>}
                        <Text style={pageStyles.contentText}>OTHER RESOURCES</Text>
                    </View>
                </TouchableHighlight>
                <View style={{height: '20%', marginTop: '20%'}}></View>
            </View>
            {aboutCard}
            {guideCard}
            {syllabulsCard}
            {matCard}
            {lectureNotesCard}
            {RESOURCES_CARD}
            {loading}
            {BLOCKED_FEATURE_CARD}
            <StatusBar style="light" />
        </SafeAreaView>

    )
}