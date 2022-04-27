import React, {useState, useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import MathJax from 'react-native-mathjax';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { getOfflineCollections, getToken } from "../utils/pastquestions.utils";
import LoadingComponent from "../components/loading.component"
import BlockedFeature from "../components/BlockedFeature.component"
import StartPracticeQuestion from '../components/StartPracticeQuestion.component';

import {
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    SafeAreaView,
    Image,
    Linking,
    Alert,
    BackHandler
} from 'react-native';
import { usePreventScreenCapture } from 'expo-screen-capture'
import AsyncStorage from "@react-native-async-storage/async-storage";

import pageStyles from '../styles/pqScreenStyles.js';
import styles from '../styles/master.js';
import { FlatList } from 'react-native-gesture-handler';
import AnswerComponent from '../components/Answer.component';
const pqData = require("../scripts/pqData.json");


let renderStartPracCard = false
let submitted = false
let timerInterval = null // this is to prevent memory leak
let testDate
let timeTestStarted
let start_Prac_Card_Displayed = false

let is_ans_card_displayed = false
let is_view_quest_card_displayed = false
let is_result_card_displayed = false

export default function StartPrac({navigation}) {
    Platform.OS !== 'web'?
        usePreventScreenCapture():null
    
    function openMenu () {
        navigation.openDrawer();
    }
    
    BackHandler.addEventListener('hardwareBackPress', function () {
        if (!start_Prac_Card_Displayed || !navigation.isFocused()) {
            return false
        } else if (is_ans_card_displayed) {
            closeAnsPage()
        } else if (is_view_quest_card_displayed) {
            closeViewQuestCard()
        } else if (is_result_card_displayed) {
            closeResultArea()
        } else {
            Alert.alert(
                'Are you sure you want to cancel the test?', 
                '',
                [
                    {
                        text: 'YES',
                        onPress: ()=> closePracCard()
                    },

                    {
                        text: 'NO',
                        onPress: ()=> 'user said no'
                    }
                ]
            )
        }
        return true;
    });

    const is_token_obtained = useRef(false)
    
    function DISPLAY_BLOCKED_FEATURE_CARD(tokenPresent) {
        !tokenPresent?setBLOCKED_FEATURE_CARD(
            <BlockedFeature navFunc={() => navigation.navigate('Register')}/>
        ):
        displayPracCard()
    }



    const [options, setOptions] = useState()
    const [TimeListState, setTimeListState] = useState()
    const [pracCard, setPracCard] = useState()
    const [questViewCard, setquestViewCard] = useState()
    const [BLOCKED_FEATURE_CARD, setBLOCKED_FEATURE_CARD] = useState()
    const [resultState, setresultState] = useState()
    const [loading, setloading] = useState()

    const optionsRef = useRef([])
    const label = useRef('')
    const pathObj = useRef({
        course: '',
        subject: 'All',
    })
    
    useEffect(() => {
        getCourseData()
    }, [])

    const getCourseData = () => {
        optionsRef.current = []
        selectedSubject.current = 'Subject'
        pathObj.current.subject = ''
        label.current = 'Course'
        const tempArray = [... getOfflineCollections()]
        tempArray.forEach(course => {
            optionsRef.current = optionsRef.current.concat(course.courseName)
        });
        optionsRef.current = [... new Set(optionsRef.current)];
    }

    const getSubjects = (courseName) => {
        optionsRef.current = []
        pqData.forEach(course => {
            if (course.courseName === courseName) {
                course.content.forEach(year => {
                    year.content.forEach(subject => {
                        optionsRef.current.push(subject.subject)
                    });
                });
                label.current = 'Subject'
                optionsRef.current = [... new Set(optionsRef.current)]
            }
        });
        optionsRef.current.push('ALL')
    }
    
    const selectedCourse = useRef('Course: ')
    const selectedSubject = useRef('Subject: ')
    const displayOptions = labelName => {
        if(pathObj.current.course ==='' || labelName == 'Course') {
            getCourseData()
        } else {
            getSubjects(pathObj.current.course)
        }
        setOptions(
            <View style={[pageStyles.listOptionsCont, {position: 'absolute', zIndex: 5, backgroundColor: '#fff'}]}>
                <Text style={pageStyles.labelHeading}>Select {label.current.replace('courseName', 'Course Name')}</Text>
                <FlatList
                    data={optionsRef.current}
                    contentContainerStyle = {{paddingBottom: optionsRef.current.length*100, width: '100%', top: '5%'}}
                    renderItem={({item}, index)=> {
                        return (
                            <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' key={index} style={pageStyles.listOptions} onPress={()=> {
                                if (labelName==='Subject') {
                                    pathObj.current.subject = item
                                    selectedSubject.current = `${label.current}: ${item.toUpperCase()}`
                                } else {
                                    pathObj.current.course = item
                                    selectedCourse.current = `${label.current}: ${item.toUpperCase()}`
                                    getSubjects(item)
                                }
                                hideOptions()
                            }}>
                                <Text style={pageStyles.listOptionsText}>{item.toUpperCase()}</Text>
                            </TouchableHighlight>
                        )
                    }}
                    keyExtractor = {(item, index)=> index.toString()}
                />
                <TouchableOpacity style={pageStyles.cancelButn} onPress={hideOptions}>
                    <Text style={pageStyles.listButnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function hideOptions() {
        setOptions()
    }
    
    const enableTimerButnValue = useRef('Timer: off')
    const [showTimerSettings, setshowTimerSettings] = useState({display: 'none'})

    const enableTimerFunc = () => {
        if (enableTimerButnValue.current === 'Timer: on') {
            enableTimerButnValue.current = 'Timer: off'
            setshowTimerSettings({display: 'none'});
        } else {
            enableTimerButnValue.current = 'Timer: on'
            setshowTimerSettings({display: 'flex'});
        }
    }

    let givenTime = useRef(60*60) //1 hr in secs
    const [timerState, settimerState] = useState('Select Time')
    
    const displayTimeList = () => {
        setTimeListState(
            <View style={pageStyles.list}>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    settimerState('Time: 15mins')
                    givenTime.current = (15*60) //converts to secs
                    hideTimeList()
                }}>
                    <Text style={pageStyles.itemName}>15mins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    settimerState('Time: 30mins')
                    givenTime.current = (30*60) //converts to secs
                    hideTimeList()
                }}>
                    <Text style={pageStyles.itemName}>30mins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    settimerState('Time: 1hr')
                    givenTime.current = (60*60) //converts to secs
                    hideTimeList()
                }}>
                    <Text style={pageStyles.itemName}>1hr</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    settimerState('Time: 1hr 30mins')
                    givenTime.current = (90*60) //converts to secs
                    hideTimeList()
                }}>
                    <Text style={pageStyles.itemName}>1hr 30mins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    settimerState('Time: 2hrs')
                    givenTime.current = (120*60) //converts to secs0
                    hideTimeList()
                }}>
                    <Text style={pageStyles.itemName}>2hrs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.cancelButn} onPress={hideTimeList}>
                    <Text style={pageStyles.listButnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function hideTimeList() {
        setTimeListState()
    }

    let questionsToDisplay = useRef([])
    const displayPracCard = () => {
        testDate = Date().substr(0, 24) //returns day month year and time
        
        let selectedQuestions = []
        
        if (pathObj.current.course !== '') { //if the course has been selected
            pqData.forEach(course => {
                if (course.courseName === pathObj.current.course) {
                    course.content.forEach(year => {
                        year.content.forEach(subject => {
                                if (pathObj.current.subject === 'ALL') { //check if user wants all subjects
                                    subject.content.forEach(section => {
                                        section.section=== 'Objective'? selectedQuestions = selectedQuestions.concat(section.content):''
                                    });
                                } else { //else if user wants a particular subject
                                    if (subject.subject === pathObj.current.subject) {
                                        subject.content.forEach(section => {
                                            section.section=== 'Objective'? selectedQuestions = selectedQuestions.concat(section.content):''
                                        });
                                    }
                                }
                            });
                        });
                    }
                });

            fiterFunc(selectedQuestions).then(returnedArray=> {
                questionsToDisplay.current = [... returnedArray]
                startPrac()
            })
            
        } else {
            Alert.alert('', 'You Have Not Selected A course!')
        }
    }

    const displayLoadingComponent = (timeout) => {
        setloading(
            <View style={{width: wp('100%'), height: hp('100%'), top: hp('17%'), position: 'absolute'}}>
                <LoadingComponent />
            </View>
        )

        setTimeout(()=> {
            setloading()
        }, timeout)
    }

    function genRandNum(questionsInSection, noOfQuestionsToSelect) {
        let indexesToSelect = []
        let randomNum
        
        while (noOfQuestionsToSelect > indexesToSelect.length && questionsInSection.length>noOfQuestionsToSelect) {
            for (let i = 0; i < noOfQuestionsToSelect; i++) {
                randomNum = Math.ceil(Math.random()*questionsInSection.length)
                indexesToSelect.push(randomNum)
            }
            indexesToSelect = [... new Set(indexesToSelect)]
        }
        return indexesToSelect
    }
    
    const noOfQuestions = useRef(0)

    function fiterFunc (questionsInSection) {
        if (pathObj.current.subject === 'ALL') {
            noOfQuestions.current = 50
        } else {
            noOfQuestions.current = 15
        }

        const questionsToDisplay = []

        return new Promise((resolve) => {
            genRandNum(questionsInSection, noOfQuestions.current).forEach(questionNo => {
                questionsToDisplay.push({... questionsInSection[questionNo]})
            });
            while (questionsToDisplay.length>noOfQuestions.current) {
                questionsToDisplay.pop()
            }
            renderStartPracCard = true
            resolve(questionsToDisplay)
        })
    }

    const timerStarted  = useRef(false);
    const startPrac = (shouldDisplayLoadingComponent, customTime) => {
        shouldDisplayLoadingComponent === false?'':displayLoadingComponent(customTime?customTime:2000)
        let keyIndex = 0
        const seconds = (currentTime.current%60)
        const minutes = ((currentTime.current/60)|0)%60
        const hour  = (currentTime.current/3600)|0
        const dataArr = [... questionsToDisplay.current]
        /** there seems to be a performance issue when options are clicked, this might be due to the re rendering of the entire questions whenever a new options is selected */
        setPracCard(
            <View style={[pageStyles.pqCard, {position: 'absolute', top: hp('17%'), backgroundColor: '#fff', height: hp('83%')}]}>
                <View style={pageStyles.pqHeader}>
                    <TouchableOpacity onPress = {()=> {
                        Alert.alert(
                            'Are you sure you want to cancel the test?', 
                            '',
                            [
                                {
                                    text: 'YES',
                                    onPress: ()=> closePracCard()
                                },
            
                                {
                                    text: 'NO',
                                    onPress: ()=> ('user said no')
                                }
                            ]
                        )
                    }} style={pageStyles.closePqCard}>
                        <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                    </TouchableOpacity>
                    <View style={[{right: '5%', alignSelf: 'flex-end'}, showTimerSettings]}>
                        <Text style={pageStyles.timeDisplayed}>{`Time: ${hour<10?'0'+hour:hour}: ${minutes<10?'0'+minutes:minutes}: ${seconds<10?'0'+seconds:seconds}`}</Text>
                    </View>
                </View>
                <View style={pageStyles.pqCont}>
                    <FlatList
                        data={dataArr}
                        contentContainerStyle = {{width: '100%', alignContent: 'space-around', paddingBottom: questionsToDisplay.current.length*100}}
                        renderItem={({item}) => {
                            if (item && item.content) {
                                const {Data} = item.content.Data
                                if (Data) {
                                    return (
                                        <StartPracticeQuestion questionData={Data} displayLoadingComponent={displayLoadingComponent}/>
                                    )
                                }
                            }
                        }}
                        keyExtractor = {(item,index) => index.toString()}
                    />
                </View>
                <TouchableHighlight style={pageStyles.submitButn} underlayColor='rgba(52, 52, 52, 0)' onPress={submit}>
                    <Text style={pageStyles.submitButnText}>Submit</Text>
                </TouchableHighlight>
            </View>
        )
        start_Prac_Card_Displayed = true
        if (!timerStarted.current && enableTimerButnValue.current === 'Timer: on') {
            startCountDown()
        }
    }

    let currentTime = useRef(givenTime.current)
    function startCountDown() {
        currentTime.current = givenTime.current // updating current time in other to start counting
        timerStarted.current = true
        timerInterval = setInterval(() => {
            if (currentTime.current>0) {
                currentTime.current--
                startPrac(false)
            } else {
                submit()
            }
        }, 1000)
    }

    const closePracCard = () => {
        start_Prac_Card_Displayed = false
        timerStarted.current  = false
        questionsToDisplay.current = []
        setPracCard()
        clearInterval(timerInterval)
        if (givenTime.current === (15*60)) {
            settimerState('Time: 15mins')
        } else if (givenTime.current === (30*60)) {
            settimerState('Time: 30mins')
        } else if (givenTime.current === (60*60)) {
            settimerState('Time: 1hr')
        } else if (givenTime.current === (90*60)) {
            settimerState('Time: 1hr 30mins')
        } else if (givenTime.current === (120*60)) {
            settimerState('Time: 2hr')
        }
    }
    
    function submit() {
        displayLoadingComponent(2000)
        let score = 0
        submitted = true
        let noOfQuestionsAttempted = 0
        questionsToDisplay.current.forEach(({content}) => {
            if (content) {
                const {Data} = content.Data
                if (Data) {
                    if (Data.correctOption === Data.userOption || Data.correctOption === '' && Data.userOption != '') { // if user got the answer or if there is no correct option but th user attempted the question
                        score++
                    }
                    
                    if (Data.userOption != '') { //if user attempted question
                        noOfQuestionsAttempted++
                    }
                } 
            }
        });
        is_result_card_displayed = true
        setresultState(
            <View style={[pageStyles.pqCard, {position: 'absolute', top: hp('17%'), backgroundColor: '#fff', height: hp('83%')}]}>
                <View style={pageStyles.pqHeader}>
                    <View style={{display: 'flex'}}>
                        <Text style={[pageStyles.timeDisplayed]}>You Scored: {score}/{questionsToDisplay.current.length}</Text>
                    </View>
                    <TouchableOpacity onPress = {closeResultArea} style={pageStyles.closePqCard}>
                        <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={pageStyles.pqCont}>
                    <FlatList
                        data={questionsToDisplay.current}
                        contentContainerStyle = {{width: '100%', alignContent: 'space-around', paddingBottom: questionsToDisplay.current.length*100}}
                        renderItem={({item}) => {
                            if (item && item.content) {
                                const {Data} = item.content.Data
                                if (Data) {
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
                                                                ${Data.question.replace('max-width: 180px;', 'max-width: 90vw;').trim()}
                                                            </div> 
                                                        </body>
                                                    
                                                    `
                                                }
                                                mathJaxOptions={{ 
                                                    showMathMenu: false,
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
                                            <TouchableHighlight underlayColor='rgba(52, 52, 52, 0)' style={pageStyles.ansButn} onPress={()=> 
                                                Alert.alert(`Correct Option: ${Data.correctOption}`, '', [
                                                    {
                                                        text: 'View Solution',
                                                        onPress: ()=> showAns({answer: Data.answer, correctAnswer: Data.correctOption})
                                                    },

                                                    {
                                                        text: 'Cancel',
                                                        onPress: () => ''
                                                    }
                                                ], {cancelable: true})
                                            }>
                                                <Text style = {pageStyles.ansButnText}>ANSWER</Text>
                                            </TouchableHighlight>
                                            <View style={[pageStyles.questOptionsContainer, {borderTopLeftRadius: 0, borderTopRightRadius: 0}]}>
                                                <View style={[pageStyles.questOptionsButn, Data.correctOption === 'A'?{backgroundColor: 'green'}:Data.userOption === 'A'?{backgroundColor: 'red'}:{backgroundColor: '#9c27b0'}]}>
                                                    <Text style={pageStyles.questOptionsText}>A</Text>
                                                </View>
                                                <View style={[pageStyles.questOptionsButn, Data.correctOption === 'B'?{backgroundColor: 'green'}:Data.userOption === 'B'?{backgroundColor: 'red'}:{backgroundColor: '#9c27b0'}]}>
                                                    <Text style={pageStyles.questOptionsText}>B</Text>
                                                </View>
                                                <View style={[pageStyles.questOptionsButn, Data.correctOption === 'C'?{backgroundColor: 'green'}:Data.userOption === 'C'?{backgroundColor: 'red'}:{backgroundColor: '#9c27b0'}]}>
                                                    <Text style={pageStyles.questOptionsText}>C</Text>
                                                </View>
                                                <View style={[pageStyles.questOptionsButn, Data.correctOption === 'D'?{backgroundColor: 'green'}:Data.userOption === 'D'?{backgroundColor: 'red'}:{backgroundColor: '#9c27b0'}]}>
                                                    <Text style={pageStyles.questOptionsText}>D</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }
                            }
                        }}
                        keyExtractor = {(item,index) => index.toString()}
                    />
                </View>
            </View>
        )

        saveTestData({
            testDate,
            score,
            course: pathObj.current.course,
            noOfQuestions,
            noOfQuestionsAttempted,
            timeTaken: Math.ceil((new Date().getTime() - timeTestStarted)/1000), //converts to sec
        })
    }
    
    function closeResultArea() {
        if (is_ans_card_displayed) {
            closeAnsPage()
        } else {
            closePracCard()
            setresultState()
        }
        is_result_card_displayed = false
    }

    const saveTestData = async testdata => {
        try {
            await AsyncStorage.setItem(testDate, JSON.stringify(testdata))
        } catch (error) {
            // console.log(error);
        }
    }

    const [ansPage, setansPage] = useState()

    const showAns = data => {
        setqualityContButnDis({display: 'flex'})
        setansPage(
          <AnswerComponent data={data} />
        )
        is_ans_card_displayed = true
    }
    
    const closeAnsPage = () => {
        setqualityContButnDis({display: 'none'})
        setansPage();
        is_ans_card_displayed = false
    }

    const [qualityContButnDis, setqualityContButnDis] = useState({display: 'none'})
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCont}>
                <Text style={styles.baseText}>START PRACTICE</Text>
                <TouchableOpacity style={styles.menuIcon} onPress={openMenu}>
                    <Image source={require('../icons/menuIcon.png')}/>
                </TouchableOpacity>
                <TouchableOpacity style={[pageStyles.qualityContButn, qualityContButnDis]} onPress={() => {
                    Alert.alert('Quality Control Service',
                        `Did you find an error in this question/solution, \nif yes, kindly contact an Admin on WhatsApp.`,
                        [
                            {
                                text: 'YES',
                                onPress: ()=> Linking.openURL(`https://wa.me/+2348067124123?text=I%20contacted%20you%20from%20JUPEB%20STUDY%20APP%20regarding%20Quality%20Control.`)
                            }, 

                            {
                                text: 'NO',
                                onPress: ()=> ('Do nothing'),
                                style: 'cancel'
                            },

                        ], {cancelable: true}
                    )
                }}>
                    <Image style={pageStyles.qualityContButnImg} resizeMode={'center'} source={require('../icons/flag.png')}/>
                </TouchableOpacity>
            </View>
            <View style={pageStyles.listOptionsCont}>
                <TouchableOpacity style={pageStyles.listOptions} onPress = {()=> {
                    displayOptions('Course')
                }}>
                    <Text style={pageStyles.listOptionsText}>{selectedCourse.current}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.listOptions} onPress = {()=> {
                    pathObj.current.course !== ''?displayOptions('Subject'): displayOptions('Course')
                }}>
                    <Text style={pageStyles.listOptionsText}>{selectedSubject.current}</Text>
                </TouchableOpacity>
                <View style={pageStyles.timerCont}>
                    <TouchableOpacity onPress={enableTimerFunc} style = {pageStyles.enableTimerButn}>
                        <Text style = {pageStyles.enableTimerText}>{enableTimerButnValue.current}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={displayTimeList} style={[pageStyles.timeBox, showTimerSettings]}>
                        <Text style={pageStyles.time}>{timerState}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={pageStyles.startButn} onPress={()=>getToken(DISPLAY_BLOCKED_FEATURE_CARD)}>
                        <Text style={pageStyles.startText}>Start</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {BLOCKED_FEATURE_CARD}
            {options}
            {TimeListState}
            {pracCard}
            {resultState}
            {questViewCard}
            {ansPage}
            {loading}
            <StatusBar style="light" />
        </SafeAreaView>
    )
}