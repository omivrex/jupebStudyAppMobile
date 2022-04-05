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
    BackHandler} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { usePreventScreenCapture } from 'expo-screen-capture'
import styles from '../styles/master.js';
import pageStyles from '../styles/pqScreenStyles.js';
import AnswerComponent from '../components/Answer.component';
import AsyncStorage from '@react-native-async-storage/async-storage';

let renderCollection = true
let token = false
const allowedTimeForUnpaidUsers = 30000 /** 1mins */
export default function pqScreen({navigation}) {
    usePreventScreenCapture()
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

    const IS_BLOCKED_FEATURE_CARD_DISPLAYED = useRef(false)
    
    const IS_GET_TOKEN_CALLED = useRef(false)
    
    const isInternetReachable = useRef(false)
    
    useEffect(() => {
        (async ()=> {
            isInternetReachable.current = (await network.getNetworkStateAsync()).isInternetReachable
            console.log('isInternetReachable', isInternetReachable.current)
            isInternetReachable.current? getOnlineQuestions(path.current):
            getOfflineQuestions()
        })()
    }, [])
    
    const pathToDisplayWhenOffline = useRef([])
    const getOfflineQuestions = async path => {
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
                preventBackHandler.current = true
                returnedArray.forEach(question => {
                    tempArray.push({data: getSectionsLocalQuestions(offlinePath.current, question)})
                });
                renderCollection = false
                tempArray.length?setcollectionData([... tempArray]):null
                const lastPreviewDate = await AsyncStorage.getItem('lastPreviewDate')
                const currentDate = new Date().getDate().toString()
                console.log('lastPreviewDate', lastPreviewDate, 'currentDate', currentDate)
                if (lastPreviewDate === currentDate) {
                    getToken(DISPLAY_BLOCKED_FEATURE_CARD)
                    closePqCard()
                } else {
                    setTimeout(()=> {
                        getToken(DISPLAY_BLOCKED_FEATURE_CARD)
                        preventBackHandler.current = false
                    }, allowedTimeForUnpaidUsers)
                    AsyncStorage.setItem('lastPreviewDate', currentDate.toString())
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
                                console.log('lastPreviewDate', lastPreviewDate, 'currentDate', currentDate)
                                if (lastPreviewDate === currentDate) {
                                    getToken(DISPLAY_BLOCKED_FEATURE_CARD)
                                    closePqCard()
                                } else {
                                    setTimeout(()=> {
                                        getToken(DISPLAY_BLOCKED_FEATURE_CARD)
                                        preventBackHandler.current = false
                                    }, allowedTimeForUnpaidUsers)
                                    AsyncStorage.setItem('lastPreviewDate', currentDate.toString())
                                }
                            }
                        })
                    })
                } else {
                    setcollectionData([... returnedArray])
                    renderCollection = true
                }
            } else {
                Alert.alert('Network Error', 'Check your network settings \nYou are now viewing offline questions', [{text: 'Ok', onPress: () => ''}], {cancelable: true})
                isInternetReachable.current = false
                getOfflineQuestions()
            }
            setloading()
        })
    }
    
    console.log(IS_GET_TOKEN_CALLED.current, IS_BLOCKED_FEATURE_CARD_DISPLAYED.current);
    
    function openMenu () {
        navigation.openDrawer();
    }
    
    function DISPLAY_BLOCKED_FEATURE_CARD(tokenPresent) {
        preventBackHandler.current = false
        !tokenPresent?setBLOCKED_FEATURE_CARD(
            <BlockedFeature navFunc={() => navigation.navigate('Register')}/>
        ):
            null
    }
    
    const preventBackHandler = useRef(false)
    BackHandler.addEventListener('hardwareBackPress', function () {
        console.log('Back Handler Debug:', preventBackHandler.current, isAnsCardDisplayed.current, navigation.isFocused())
        if (preventBackHandler.current || isAnsCardDisplayed.current) {
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


    const closePqCard = () => {
        qualityContButnDis.current = ({display: 'none'})
        if (isInternetReachable.current) {
            const newPath = path.current.split('/')
            newPath.pop()
            newPath.pop()
            preventBackHandler.current = (newPath.length>2)
            path.current = newPath.join('/')
            getOnlineQuestions(path.current)
        } else {
            const keys = Object.keys(offlinePath.current)
            let index = keys.length - 1
            while (offlinePath.current[keys[index]] === null) { /** start with the last property if its null move to the next */
                index--
            }
            offlinePath.current[keys[index]] = null
            pathToDisplayWhenOffline.current.pop()
            getOfflineQuestions(offlinePath.current)
        }
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
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCont}>
                <Text style={styles.baseText}>PAST QUESTIONS</Text>
                <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)'style={[pageStyles.qualityContButn, qualityContButnDis.current]} onPress={() => {
                    Alert.alert('Quality Control Service',
                        `Did you find an error in this question/solution, \nif yes, kindly contact an Admin on WhatsApp.`,
                        [
                            {
                                text: 'YES',
                                onPress: ()=> Linking.openURL(`https://wa.me/+2348067124123?text=I%20contacted%20you%20from%20JUPEB%20STUDY%20APP%20regarding%20Quality%20Control.`)
                            }, 

                            {
                                text: 'NO',
                                onPress: ()=> console.log('Do nothing'),
                                style: 'cancel'
                            },

                        ], {cancelable: true}
                    )
                }}>
                    <Image style={pageStyles.qualityContButnImg} resizeMode={'center'} source={require('../icons/flag.png')}/>
                </TouchableHighlight>
                <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' style={styles.menuIcon} onPress={openMenu}>
                    <Image source={require('../icons/menuIcon.png')}/>
                </TouchableHighlight>
            </View>
            {renderCollection? (
                <View style={pageStyles.listOptionsCont}>
                    {label.current !=='questionNumber'?<Text style={pageStyles.labelHeading}>Select {(label.current === 'courseName')?'Course Name':label.current}</Text>:<></>}
                    <FlatList
                        data={collectionData}
                        contentContainerStyle = {{paddingBottom: collectionData.length*100, width: '100%', top: '10%'}}
                        renderItem={({item}, index)=> {
                            const data = Object.values(item)[0]
                            path.current !== 'pastquestions' || Object.values(offlinePath.current).filter(Boolean).length?
                            preventBackHandler.current = true:
                            preventBackHandler.current = false
                            if (label.current !=='questionNumber') {
                                return (
                                    <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' key={index} style={pageStyles.listOptions} onPress={()=> {
                                        preventBackHandler.current = true
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
                            <Image resizeMode={'center'} style={{width: '80%'}} source={require('../icons/back.png')}/>
                        </TouchableHighlight>
                    </View>
                    <FlatList
                        data={collectionData}
                        contentContainerStyle = {{width: '100%', alignContent: 'space-around', paddingBottom: collectionData.length*100}}
                        renderItem={({item}) => {
                            preventBackHandler.current = true
                            return (
                                <View style={{
                                        borderColor: '#9c27b0',
                                        borderBottomWidth: 2,
                                        width: '90%',
                                        marginVertical: hp('3%'),
                                        left: '5%',
                                        justifyContent: 'center'
                                    }}>
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
                                                        ${item&&item.data?item.data.question.replace('max-width: 180px;', 'max-width: 90vw;'):Alert.alert('Your Offline', 'Check your Internet connection', [{text: 'Ok', onPress: () => ''}], {cancelable: true})}
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
                                    <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' style={pageStyles.ansButn} onPress={()=> {
                                        item && item.data && item.data.correctOption !== ''?
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
                                        : showAns(item && item.data? {answer: item.data.answer, correctAnswer: item.data.correctOption}:Alert.alert('Your Offline', 'Check your Internet connection', [{text: 'Ok', onPress: () => ''}], {cancelable: true}))
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
            <StatusBar style="light" />
        </SafeAreaView>
    )
}   
