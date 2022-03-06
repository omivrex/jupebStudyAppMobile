import React, {useState, useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MathJax from 'react-native-mathjax';
import {sendGetCollectionReq} from "../utils/pastquestions.utils"

import {
    Text,
    View,
    TouchableOpacity,
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
// const {images} = require("../Scripts/imageUrl.js");

// const sectionToDisplayImgs = {
//     questions: [],
//     answers: [],
// }

let renderCollection = true
let pqCardDisplayed = false
let IS_ANS_CARD_DISPLAYED = false
let token = false

export default function pqScreen({navigation}) {
    usePreventScreenCapture()
    const [pqCardState, setPqCardState] = useState()
    const [BLOCKED_FEATURE_CARD, setBLOCKED_FEATURE_CARD] = useState()

    const path = useRef('pastquestions')
    const questionNumber = useRef(0)
    const [collectionData, setcollectionData] = useState([])

    const IS_BLOCKED_FEATURE_CARD_DISPLAYED = useRef(false)
    
    const IS_GET_TOKEN_CALLED = useRef(false)

    useEffect(() => {
        getCollection(path.current)
    }, [])
    
    const tempArray = []
    const getCollection = (collectionName, shouldReturnId, dataSize) => {
        sendGetCollectionReq(collectionName, shouldReturnId).then(returnedArray => {
            if (shouldReturnId){
                tempArray.push(returnedArray[0])
                tempArray.length===dataSize?
                setcollectionData([...tempArray]):''
            } else {
                setcollectionData([... returnedArray])
            }
            renderCollection = !shouldReturnId
            // console.log('collectionData', collectionData)
            // Alert.alert('Data Loaded','')
        })
    }
    
    const pqPathObj = useRef({
        course: '',
        year: '',
        subject: 'All',
        section: 'All'
    })
    
    console.log(IS_GET_TOKEN_CALLED.current, IS_BLOCKED_FEATURE_CARD_DISPLAYED.current);

    function openMenu () {
        navigation.openDrawer();
    }
    
    const getToken = async () => {
        if (!IS_GET_TOKEN_CALLED.current) {
            try {
                token = await AsyncStorage.getItem('vpa')
            } catch (err) {
                console.log(err);
            }
            IS_GET_TOKEN_CALLED.current = true
        }
    }
    
    
    function DISPLAY_BLOCKED_FEATURE_CARD() {
        console.log('called', token);
        console.log(`token is ${token}`);
        if (!IS_BLOCKED_FEATURE_CARD_DISPLAYED.current && token === 'false') {
            setBLOCKED_FEATURE_CARD(
                <View style={[styles.BLOCKED_FEATURE_CARD]}>
                    <Text style={styles.BLOCKED_FEATURE_CARD_TEXT}>
                        This Feature Is Only Available To Paid Users.
                        Head To The Payment Section To Make Payment.
                    </Text>
                </View>
            )
            closePqCard()
            IS_BLOCKED_FEATURE_CARD_DISPLAYED.current = true
        }
    }
    
    BackHandler.addEventListener('hardwareBackPress', function () {
        if (!pqCardDisplayed || !navigation.isFocused() || IS_BLOCKED_FEATURE_CARD_DISPLAYED.current) {
            return false
        } else {
            if (IS_ANS_CARD_DISPLAYED) {
                closeAnsPage()
            } else if (pqCardDisplayed) {
                closePqCard()
                setBLOCKED_FEATURE_CARD()
                IS_BLOCKED_FEATURE_CARD_DISPLAYED.current = false
            }
            return true;
        }
    });

    let questNo = questionDisplayed
    function makeGlobal(data) {
       questNo = data.questNo
        getToken()
        console.log(pqPathObj.current.course);
        if (pqPathObj.current.course == 'maths' || pqPathObj.current.course == 'physics') { //give user access to only 5 questions when physics or mamths is selected 
            if (questNo >= 5) {
                DISPLAY_BLOCKED_FEATURE_CARD()
            }
        } else if (pqPathObj.current.course != '') { //else display BLOCKED_FEATURE CARD
            DISPLAY_BLOCKED_FEATURE_CARD()
        }
       if (data.renderCollection === true && sectionToDisplayImgs.questions.length != 0) {
        pqCardRender()
        renderCollection = false // this to prevent multiple renders
        setqualityContButnDis({display: 'flex'})
       }
    }
    
    const [questionDisplayed, setquestionDisplayed] = useState(0)

    const showPrev = () => {
        if (collectionData[val-1]) {
            val -=1
        } else {
            Alert.alert('', 'You Are At The Beginning Of This Section!')
        }
        setquestionDisplayed(val)
        console.log(collectionData)
        displayPqCard(collectionData[val].Data)

    }
    
    let val = questionDisplayed
    function showNext() {
        if (collectionData[val+1]) {
            val +=1
        } else {
            Alert.alert('', 'You Have Reached The End Of This Section!')
        }
        setquestionDisplayed(val)
        console.log(collectionData)
        displayPqCard(collectionData[val].Data)
    }

    const displayPqCard = data=> {
        
        setPqCardState(
            
        )
        pqCardDisplayed = true

    }
    

    const closePqCard = () => {
        setqualityContButnDis({display: 'none'})
        renderCollection = true
        setcollectionData([])
        setPqCardState()
        getCollection(path.current)

        questNo = 0
        setquestionDisplayed(questNo)
    }

    const [ansCard, setansCard] = useState()
    const showAns = data => {
      setansCard(
        <View style={pageStyles.pqCard}>
            <View style={pageStyles.pqHeader}>
                <Text style={pageStyles.pqHeaderText}>{([...new Set(path.current.split('/'))]).join(' > ').toUpperCase()}</Text>
                <TouchableOpacity onPress = {closeAnsPage} style={pageStyles.closePqCard}>
                    <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                </TouchableOpacity>
            </View>
            <View style={pageStyles.pqCont}>
                <MathJax
                    html={
                        `
                            <body>
                                <div style="font-size: 1.7em">
                                    ${data}
                                </div> 
                            </body>
                        
                        `
                    }
                    mathJaxOptions={{
                        messageStyle: "none",
                        extensions: ["tex2jax.js"],
                        jax: ["input/TeX", "output/HTML-CSS"],
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
                    style={{width: '100%', height:'100%'}}
                
                />
            </View>
        </View>
      )
      IS_ANS_CARD_DISPLAYED = true
    }
    const closeAnsPage = () => {
        setansCard()
        IS_ANS_CARD_DISPLAYED = false
    }
    
    const [qualityContButnDis, setqualityContButnDis] = useState({display: 'none'})
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCont}>
                <Text style={styles.baseText}>PAST QUESTIONS</Text>
                <TouchableOpacity style={styles.menuIcon} onPress={openMenu}>
                    <Image source={require('../icons/menuIcon.png')}/>
                </TouchableOpacity>
            </View>
            {renderCollection? (
                <View style={pageStyles.listOptionsCont}>
                    {collectionData.map((dataObj, index) => {
                        const data = Object.values(dataObj)[0]
                        const label = Object.keys(dataObj)[0]
                        if (label!=='questionNumber') {
                            return (
                                <TouchableOpacity key={index} style={pageStyles.listOptions} onPress={()=> {
                                    path.current += `/${data}/${data}`
                                    getCollection(path.current, false)
                                }}>
                                    <Text style={pageStyles.listOptionsText}>{(`${label}: ${data}`).toUpperCase()}</Text>
                                </TouchableOpacity>
                            )
                        } else {
                            getCollection(path.current+`/${data}/${data}`, true, collectionData.length)
                        }
                    })}
                </View>
            ): (
                <View style={{width: wp('100%'), top: hp('17%')}}>
                    <FlatList
                        data={collectionData}
                        contentContainerStyle = {{width: '100%', height: '100%', alignContent: 'space-around'}}
                        renderItem={({item}) => (
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
                                            <body style="width: 100%;">
                                                <div style="font-size: 1.3em; font-family: Roboto, sans-serif, san Francisco">
                                                    ${item.data.question}
                                                </div> 
                                            </body>
                                        
                                        `
                                    }
                                    mathJaxOptions={{
                                        messageStyle: "none",
                                        extensions: ["tex2jax.js"],
                                        jax: ["input/TeX", "output/HTML-CSS"],
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
                                <TouchableOpacity style={pageStyles.ansButn} onPress={()=> showAns(item.data.answer)}>
                                    <Text style = {pageStyles.ansButnText}>ANSWER</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor = {item => item.id}
                    />
                </View>
            )}
            {pqCardState}
            {ansCard}
            {BLOCKED_FEATURE_CARD}
            <StatusBar style="light" />
        </SafeAreaView>
    )
}   
