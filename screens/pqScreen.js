import React, {useState, useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MathJax from 'react-native-mathjax';
import {sendGetCollectionReq} from "../utils/pastquestions.utils"
import LoadingComponent from "../components/loading.component"

import {
    Text,
    View,
    TouchableHighlight,
    SafeAreaView,
    Image,
    Linking,
    FlatList,
    BackHandler} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { usePreventScreenCapture } from 'expo-screen-capture'
import styles from '../styles/master.js';
import pageStyles from '../styles/pqScreenStyles.js';

let renderCollection = true
let IS_ANS_CARD_DISPLAYED = false
let preventBackHandler = false
let token = false

export default function pqScreen({navigation}) {
    usePreventScreenCapture()
    const [BLOCKED_FEATURE_CARD, setBLOCKED_FEATURE_CARD] = useState()

    const path = useRef('pastquestions')
    const label = useRef('Course Name')
    const [collectionData, setcollectionData] = useState([])

    const IS_BLOCKED_FEATURE_CARD_DISPLAYED = useRef(false)
    
    const IS_GET_TOKEN_CALLED = useRef(false)

    useEffect(() => {
        getCollection(path.current)
    }, [])
    
    const [loading, setloading] = useState()
    const getCollection = (collectionName, getQuestionAndAnswers) => {
        setloading(
            <View style={{width: wp('100%'), height: hp('100%'), top: hp('17%'), position: 'absolute'}}>
                <LoadingComponent />
            </View>
        )
        sendGetCollectionReq(collectionName).then(returnedArray => {
            label.current = Object.keys(returnedArray[0])[0]
            if (label.current === 'questionNumber') {
                const tempArray = []
                returnedArray.forEach((element, index) => {
                    sendGetCollectionReq(path.current+`/${element.questionNumber}/${element.questionNumber}`, true).then(([questionData])=>{
                        tempArray.push(questionData);
                        console.log('tempArray', tempArray.length===returnedArray.length)
                        if (tempArray.length===returnedArray.length) {
                            preventBackHandler = true
                            renderCollection = false
                            setcollectionData([...tempArray])
                            setloading()
                        }
                    })
                })
            } else {
                label.current = (label.current === 'courseName')?'Course Name':label.current
                setcollectionData([... returnedArray])
                renderCollection = true
                setloading()
            }
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
        if (token === 'false') {
            setBLOCKED_FEATURE_CARD(
                <View style={[styles.BLOCKED_FEATURE_CARD]}>
                    <Text style={styles.BLOCKED_FEATURE_CARD_TEXT}>
                        This Feature Is Only Available To Paid Users.
                        Head To The Payment Section To Make Payment.
                    </Text>
                </View>
            )
            closePqCard()
        }
    }
    
    BackHandler.addEventListener('hardwareBackPress', function () {
        if (!preventBackHandler || !navigation.isFocused()) {
            return false
        } else {
            if (IS_ANS_CARD_DISPLAYED) {
                closeAnsPage()
            } else   {
                closePqCard()
                setBLOCKED_FEATURE_CARD()
                IS_BLOCKED_FEATURE_CARD_DISPLAYED.current = false
            }
            return true;
        }
    });


    const closePqCard = () => {
        setqualityContButnDis({display: 'none'})
        const newPath = path.current.split('/')
        newPath.pop()
        newPath.pop()
        preventBackHandler = !(newPath.length<2)
        path.current = newPath.join('/')
        renderCollection = true
        getCollection(path.current)
    }

    const [ansCard, setansCard] = useState()
    const showAns = data => {
      setansCard(
        <View style={pageStyles.pqCard}>
            <View style={pageStyles.pqHeader}>
                <Text style={pageStyles.pqHeaderText}>{([...new Set(path.current.split('/'))]).join(' > ').toUpperCase()}</Text>
                <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' onPress = {closeAnsPage} style={pageStyles.closePqCard}>
                    <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                </TouchableHighlight>
            </View>
            <View style={pageStyles.pqCont}>
                <MathJax
                    html={
                        `   
                            <body>
                                <div style="font-size: 1.3em; font-family: Roboto, sans-serif, san Francisco">
                                    ${data.replace('max-width: 180px;', 'max-width: 90vw;')}
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
                <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' style={styles.menuIcon} onPress={openMenu}>
                    <Image source={require('../icons/menuIcon.png')}/>
                </TouchableHighlight>
            </View>
            {renderCollection? (
                <View style={pageStyles.listOptionsCont}>
                    {label.current !=='questionNumber'?<Text style={pageStyles.labelHeading}>Select {label.current}</Text>:<></>}
                    <FlatList
                        data={collectionData}
                        contentContainerStyle = {{paddingBottom: collectionData.length*100, width: '100%', height: '80%', top: '10%'}}
                        renderItem={({item}, index)=> {
                            const data = Object.values(item)[0]
                            if (label.current !=='questionNumber') {
                                return (
                                    <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' key={index} style={pageStyles.listOptions} onPress={()=> {
                                        path.current += `/${data}/${data}`
                                        preventBackHandler = true
                                        getCollection(path.current, false)
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
                        <Text style={pageStyles.pqHeaderText}>{([...new Set(path.current.split('/'))]).join(' > ').toUpperCase()}</Text>
                        <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' onPress = {closePqCard} style={pageStyles.closePqCard}>
                            <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                        </TouchableHighlight>
                    </View>
                    <FlatList
                        data={collectionData}
                        contentContainerStyle = {{width: '100%', height: '100%', alignContent: 'space-around', paddingBottom: collectionData.length*100}}
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
                                                    ${item&&item.data?item.data.question.replace('max-width: 180px;', 'max-width: 90vw;'):''}
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
                                <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' style={pageStyles.ansButn} onPress={()=> showAns(item.data.answer)}>
                                    <Text style = {pageStyles.ansButnText}>ANSWER</Text>
                                </TouchableHighlight>
                            </View>
                        )}
                        keyExtractor = {(item,index) => item?item.id:index.toString()}
                    />
                </View>
            )}
            {ansCard}
            {BLOCKED_FEATURE_CARD}
            {loading}
            <StatusBar style="light" />
        </SafeAreaView>
    )
}   
