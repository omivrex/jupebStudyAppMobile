import React, {useState, useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import MathJax from 'react-native-mathjax';
import * as network from 'expo-network';
import {getOfflineCollections, getOnlineCollections, getSectionsLocalQuestions, getToken} from "../utils/pastquestions.utils"
import LoadingComponent from "../components/loading.component"
import BlockedFeature from "../components/BlockedFeature.component"

import {
    Text,
    View,
    TouchableHighlight,
    SafeAreaView,
    Image,
    Alert,
    Linking,
    FlatList,
    BackHandler
} from 'react-native';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { usePreventScreenCapture } from 'expo-screen-capture'
import styles from '../styles/master.js';
import pageStyles from '../styles/pqScreenStyles.js';
import AnswerComponent from '../components/Answer.component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";
import WebMathJaxComponent from '../components/WebMathJax.component';
import WebAlert from '../components/WebAlert.component';
import colors from '../styles/colors';

let renderCollection = true
const allowedTimeForUnpaidUsers = 30000
export default function pqScreen({navigation}) {
    Platform.OS !== 'web'?
        usePreventScreenCapture():null
    const [BLOCKED_FEATURE_CARD, setBLOCKED_FEATURE_CARD] = useState()
    
    const path = useRef('pastquestions')
    const label = useRef('Course Name')
    const offlinePath = useRef({
        courseName: null,
        year: null,
        subject: null,
        section: null
    })
    const [collectionData, setcollectionData] = useState([])

    const isInternetReachable = useRef(false)
    
    useEffect(() => {
        (async ()=> {
            isInternetReachable.current = (await network.getNetworkStateAsync()).isInternetReachable
            isInternetReachable.current? getOnlineQuestions(path.current):
            getOfflineQuestions()
        })()
    }, [])
    
    const pathToDisplayWhenOffline = useRef([])
    const getOfflineQuestions = async path => {
        preventBackHandler.current = true
        setloading(
            <View style={{width: wp('100%'), height: hp('100%'), top: hp('17%'), position: 'absolute'}}>
                <LoadingComponent />
            </View>
        )
        if (path) {
            const returnedArray = [... getOfflineCollections(path)]
            const [newLabel] = Object.keys(returnedArray[0]).filter(key => key !== 'index') // KEYS ARE IN THIS FORMAT {courseName: ..., index: ...}
            label.current = newLabel
            let tempArray = []
            if (label.current === 'questionNumber') {
                returnedArray.forEach(question => {
                    tempArray.push({data: getSectionsLocalQuestions(offlinePath.current, question)})
                });
                renderCollection = false
                tempArray.length?setcollectionData([... tempArray]):null
                const lastPreviewDate = await AsyncStorage.getItem('lastPreviewDate')
                const currentDate = new Date().getDate().toString()
                // console.log('lastPreviewDate', lastPreviewDate, 'currentDate', currentDate)
                if (lastPreviewDate === currentDate) {
                    getToken(DISPLAY_BLOCKED_FEATURE_CARD)
                } else {
                    setTimeout(()=> {
                        getToken(DISPLAY_BLOCKED_FEATURE_CARD)
                    }, allowedTimeForUnpaidUsers)
                    AsyncStorage.setItem('lastPreviewDate', currentDate)
                }
            } else {
                renderCollection = true
                setcollectionData([... returnedArray])
            }
        } else {
            setcollectionData([... getOfflineCollections()])
            label.current = 'courseName'
        }
        setloading()
    }
    
    const [loading, setloading] = useState()
    const getOnlineQuestions = (collectionName) => {
        preventBackHandler.current = true
        setloading(
            <View style={{width: wp('100%'), height: hp('100%'), top: hp('17%'), position: 'absolute'}}>
                <LoadingComponent />
            </View>
        )
        getOnlineCollections(collectionName).then(returnedArray => {
            if (returnedArray.length>0) {
                label.current = Object.keys(returnedArray[0])[0]
                if (label.current === 'questionNumber') {
                    const tempArray = []
                    returnedArray.forEach((element, index) => {
                        getOnlineCollections(path.current+`/${element.questionNumber}/${element.questionNumber}`, true).then(async ([questionData])=>{
                            tempArray.push(questionData);
                            if (tempArray.length===returnedArray.length) {
                                renderCollection = false
                                tempArray.length?setcollectionData([...tempArray]):null
                                const lastPreviewDate = await AsyncStorage.getItem('lastPreviewDate')
                                const currentDate = new Date().getDate().toString()
                                // console.log('lastPreviewDate', lastPreviewDate, 'currentDate', currentDate)
                                if (lastPreviewDate === currentDate) {
                                    getToken(DISPLAY_BLOCKED_FEATURE_CARD)
                                } else {
                                    setTimeout(()=> {
                                        getToken(DISPLAY_BLOCKED_FEATURE_CARD)
                                    }, allowedTimeForUnpaidUsers)
                                    AsyncStorage.setItem('lastPreviewDate', currentDate)
                                }
                            }
                        })
                    })
                } else {
                    setcollectionData([... returnedArray])
                    renderCollection = true
                }
            } else {
                Platform.OS!=='web'? Alert.alert('Network Error', 'Check your network settings \nYou are now viewing offline questions', [{text: 'Ok', onPress: () => ''}], {cancelable: true}):
                setwebAlert(
                    <WebAlert closeFunc={()=> setwebAlert()} title={'Network Error'} body={'Check your network settings \nYou are now viewing offline questions'}>
                        <TouchableHighlight style={{backgroundColor: colors.appColor, width: '90%', padding: 8, borderRadius: 18, marginBottom: 8.6}} onPress={e=>{
                            setwebAlert()
                        }}>
                            <Text style={{color: '#eee', textAlign: 'center'}}>OK</Text>
                        </TouchableHighlight>
                    </WebAlert>
                )
                isInternetReachable.current = false
                getOfflineQuestions()
            }
            setloading()
        })
    }
    
    function openMenu () {
        navigation.openDrawer();
    }
    
    function DISPLAY_BLOCKED_FEATURE_CARD(tokenPresent) {
        if (!tokenPresent) {
            preventBackHandler.current = false
            setBLOCKED_FEATURE_CARD(
                <BlockedFeature navFunc={() => navigation.navigate('Register')}/>
            )
        }
    }
    
    const preventBackHandler = useRef(false)
    BackHandler.addEventListener('hardwareBackPress', function () {
        console.log('Back Handler Debug:', preventBackHandler.current, isAnsCardDisplayed.current, navigation.isFocused())
        if ((preventBackHandler.current || isAnsCardDisplayed.current) && navigation.isFocused()) {
            if (isAnsCardDisplayed.current) {
                closeAnsPage()
            } else {
                closePqCard()
            }
            return true;
        } else {
            return false
        }
    });


    const closePqCard = async () => {
        console.log('called...')
        qualityContButnDis.current = ({display: 'none'})
        isInternetReachable.current = (await network.getNetworkStateAsync()).isInternetReachable
        if (isInternetReachable.current) {
            const newPath = path.current.split('/')
            newPath.pop()
            newPath.pop()
            path.current = newPath.join('/')
            getOnlineQuestions(path.current)
        } else {
            const keys = Object.keys(offlinePath.current)
            let index = keys.length - 1
            while (offlinePath.current[keys[index]] === null && index>0) { /** start with the last property if its null move to the next untill you reach the final property where the index is 0*/
                index--
            }
            offlinePath.current[keys[index]] = null
            pathToDisplayWhenOffline.current.pop()
            getOfflineQuestions(offlinePath.current)
        }
        preventBackHandler.current = (path.current !== 'pastquestions' || Object.values(offlinePath.current).filter(Boolean).length>0)
        console.log('fk aoef', preventBackHandler.current, path.current, Object.values(offlinePath.current).filter(Boolean))
        setBLOCKED_FEATURE_CARD()
        renderCollection = true
    }

    const [ansCard, setansCard] = useState()
    const isAnsCardDisplayed = useRef(false)
    const showAns = data => {
      qualityContButnDis.current = ({display: 'flex'})
      setansCard(
        <AnswerComponent data={data} />
      )
      isAnsCardDisplayed.current = true
    }
    const closeAnsPage = () => {
        qualityContButnDis.current = ({display: 'none'})
        setansCard()
        isAnsCardDisplayed.current = false
    }
    
    const qualityContButnDis = useRef({display: 'none'})

    const webBackButnImgStyle = {width: '80%', justifySelf: 'center', alignSelf: 'center', top: '2%', position: 'relative'}
    const [webAlert, setwebAlert] = useState()
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCont}>
                <Text style={styles.baseText}>PAST QUESTIONS</Text>
                <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)'style={[pageStyles.qualityContButn, qualityContButnDis.current]} onPress={() => {
                    Platform.OS !== 'web'?
                        Alert.alert('Quality Control Service',
                            `Did you find an error in this question/solution, \nif yes, kindly contact an Admin on WhatsApp.`,
                            [
                                {
                                    text: 'YES',
                                    onPress: ()=> Linking.openURL(`https://wa.me/+2348067124123?text=I%20contacted%20you%20from%20JUPEB%20STUDY%20APP%20regarding%20Quality%20Control.`)
                                }, 

                                {
                                    text: 'NO',
                                    onPress: ()=> 'Do nothing',
                                    style: 'cancel'
                                },

                            ], {cancelable: true}
                        )
                    :   setwebAlert(
                            <WebAlert closeFunc={()=> setwebAlert()} title={`Quality Control Service`} body={'Did you find an error in this question/solution, \nif yes, kindly contact an Admin on WhatsApp.'}>
                                <TouchableHighlight style={{backgroundColor: colors.appColor, width: '90%', padding: 8, borderRadius: 18, marginBottom: 8.6}} onPress={e=>{
                                    Linking.openURL(`https://wa.me/+2348067124123?text=I%20contacted%20you%20from%20JUPEB%20STUDY%20APP%20regarding%20Quality%20Control.`)
                                    setwebAlert()
                                }}>
                                    <Text style={{color: '#eee', textAlign: 'center'}}>YES</Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={{backgroundColor: colors.appColor, width: '90%', padding: 8, borderRadius: 18, marginBottom: 8.6}} onPress={e=>{
                                    ''
                                    setwebAlert()
                                }}>
                                    <Text style={{color: '#eee', textAlign: 'center'}}>NO</Text>
                                </TouchableHighlight>
                            </WebAlert>
                        )
                }}>
                    {Platform.OS!== 'web'?<Image style={pageStyles.qualityContButnImg} resizeMode={'center'} source={require('../icons/flag.png')}/>: <img src={require('../icons/flag.png')}/>}
                </TouchableHighlight>
                <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' style={styles.menuIcon} onPress={openMenu}>
                    {Platform.OS!== 'web'?<Image source={require('../icons/menuIcon.png')}/>: <img width={100} src={require('../icons/menuIcon.png')}/>}
                </TouchableHighlight>
            </View>
            {renderCollection? (
                <View style={pageStyles.listOptionsCont}>
                    {label.current !=='questionNumber'?<Text style={pageStyles.labelHeading}>Select {(label.current === 'courseName')?'Course Name':label.current}</Text>:<></>}
                    <FlatList
                        data={collectionData}
                        contentContainerStyle = {{paddingBottom: collectionData.length*100, width: '100%', top: '10%'}}
                        renderItem={({item}, index)=> {
                            if (item) {
                                const data = Object.values(item)[0]
                                if (label.current !=='questionNumber') {
                                    return (
                                        <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' key={index} style={pageStyles.listOptions} onPress={()=> {
                                            if (isInternetReachable.current) {
                                                path.current += `/${data}/${data}`
                                                getOnlineQuestions(path.current, false)
                                            } else {
                                                offlinePath.current[label.current] = item
                                                pathToDisplayWhenOffline.current.push(Object.values(item)[0])
                                                Object.values(offlinePath.current).filter(Boolean).length? /** checks if all properties in offlinePath.current is null*/
                                                getOfflineQuestions(offlinePath.current):
                                                getOfflineQuestions()
                                            }
                                        }}>
                                            <Text style={pageStyles.listOptionsText}>{(`${data}`).toUpperCase()}</Text>
                                        </TouchableHighlight>
                                    )
                                }
                            }
                        }}
                        keyExtractor = {(item, index)=> index.toString()}
                    />
                </View>
            ): (
                <View style={{width: wp('100%'), top: hp('17%')}}>
                    <View style={pageStyles.pqHeader}>
                        <Text style={pageStyles.pqHeaderText}>
                            {isInternetReachable.current?([...new Set(path.current.split('/'))]).join(' > ').replace('pastquestions > ', '').toUpperCase()
                            : pathToDisplayWhenOffline.current.join(' > ').toUpperCase()}
                        </Text>
                        <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' onPress = {()=> !isAnsCardDisplayed.current?closePqCard():closeAnsPage()} style={pageStyles.closePqCard}>
                            {Platform.OS !== 'web'?<Image resizeMode={'center'} style={{width: '80%'}} source={require('../icons/back.png')}/>:<img width={25} src={require('../icons/back.png')}/>}
                        </TouchableHighlight>
                    </View>
                    <FlatList
                        data={collectionData}
                        contentContainerStyle = {[{width: '100%', alignContent: 'space-around'}, Platform.OS !== 'web'?{paddingBottom: collectionData.length*100}:{height: '80vh', paddingBottom: '20vh', overflow: 'scroll'}]}
                        renderItem={({item}) => {
                            return (
                                <View style={{
                                        borderColor: '#9c27b0',
                                        borderBottomWidth: 2,
                                        width: '90%',
                                        marginVertical: hp('3%'),
                                        left: '5%',
                                        justifyContent: 'center'
                                    }}>
                                    {Platform.OS !== 'web'? 
                                        <MathJax
                                            html={
                                                `
                                                    <head>
                                                        <meta name="viewport"  content="width=device-width, initial-scale=1.0 maximum-scale=1.0">
                                                    </head>
                                                    <body>
                                                        <style>
                                                            * {
                                                                -webkit-user-select: none;
                                                                -moz-user-select: none;
                                                                -ms-user-select: none;
                                                                user-select: none;
                                                            }
                                                        </style>
                                                        <div style="font-size: 1em; font-family: Roboto, sans-serif, san Francisco">
                                                            ${item&&item.data?item.data.question.replace('max-width: 180px;', 'max-width: 90vw;'):'<h2 style="color: red;">Network Error!</h2>'}
                                                        </div> 
                                                    </body>
                                                
                                                `
                                            }
                                            mathJaxOptions={{
                                                messageStyle: "none",
                                                extensions: ["tex2jax.js"],
                                                jax: ["input/TeX", "output/HTML-CSS"],
                                                showMathMenu: false,
                                                tex2jax: {
                                                    inlineMath: [
                                                        ["$", "$"],
                                                        ["\\(", "\\)"],
                                                    ],
                                                    displayMath: [
                                                        ["$$", "$$"],
                                                        ["\\[", "\\]"],
                                                    ],
                                                    processEscapes: true,
                                                },
                                                TeX: {
                                                    extensions: [
                                                        "AMSmath.js",
                                                        "AMSsymbols.js",
                                                        "noErrors.js",
                                                        "noUndefined.js",
                                                    ],
                                                },

                                            }}
                                            style={{width: '100%'}}
                                        
                                        />
                                        :

                                        <WebMathJaxComponent data={item&&item.data?item.data.question.replace('max-width: 180px;', 'max-width: 90vw;'):'<h2 style="color: red;">Network Error!</h2>'}/>
                                    }
                                    <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' style={pageStyles.ansButn} onPress={()=> {
                                        item && item.data && item.data.correctOption !== ''?
                                            Platform.OS !== 'web'?
                                                Alert.alert(`Correct Option: ${item && item.data? item.data.correctOption:''}`, '', [
                                                    {
                                                        text: 'View Solution',
                                                        onPress: ()=> showAns(item && item.data? {answer: item.data.answer, correctAnswer: item.data.correctOption}:'')
                                                    },
    
                                                    {
                                                        text: 'Cancel',
                                                        onPress: () => ''
                                                    }
                                                ], {cancelable: true})
                                            : setwebAlert(
                                                <WebAlert closeFunc={()=> setwebAlert()} title={`Correct Option: ${item && item.data? item.data.correctOption:''}`} body={''}>
                                                    <TouchableHighlight style={{backgroundColor: colors.appColor, width: '90%', padding: 8, borderRadius: 18, marginBottom: 8.6}} onPress={e=>{
                                                        showAns(item && item.data? {answer: item.data.answer, correctAnswer: item.data.correctOption}:'')
                                                        setwebAlert()
                                                    }}>
                                                        <Text style={{color: '#eee', textAlign: 'center'}}>View Solution</Text>
                                                    </TouchableHighlight>
                                                    <TouchableHighlight style={{backgroundColor: colors.appColor, width: '90%', padding: 8, borderRadius: 18, marginBottom: 8.6}} onPress={e=>{
                                                        ''
                                                        setwebAlert()
                                                    }}>
                                                        <Text style={{color: '#eee', textAlign: 'center'}}>Cancel</Text>
                                                    </TouchableHighlight>
                                                </WebAlert>
                                              )
                                        : showAns(item && item.data? {answer: item.data.answer, correctAnswer: item.data.correctOption}:'')
                                        console.log('clicked')
                                    }}>
                                        <Text style = {pageStyles.ansButnText}>ANSWER</Text>
                                    </TouchableHighlight>
                                </View>
                            )
                        }}
                        keyExtractor = {(item,index) => index.toString()}
                    />
                </View>
            )}
            {ansCard}
            {loading}
            {BLOCKED_FEATURE_CARD}
            {webAlert}
            <StatusBar style="light" />
        </SafeAreaView>
    )
}   
