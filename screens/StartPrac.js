import React, {useState, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { getToken } from "../utils/startPractice.util";
import {
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Linking,
    Alert,
    ScrollView,
    BackHandler
} from 'react-native';
import { usePreventScreenCapture } from 'expo-screen-capture'
import AsyncStorage from "@react-native-async-storage/async-storage";

import pageStyles from '../styles/pqScreenStyles.js';
const {images} = require("../Scripts/imageUrl.js");
import styles from '../styles/master.js';
import { FlatList } from 'react-native-gesture-handler';

const pqPathObj = {
    course: '',
    subject: 'All',
}

const sectionToDisplayImgs = {
    questions: [],
    answers: [],
}

let renderStartPracCard = false
let timerStarted  = false;
let submitted = false
let timerInterval = null // this is to prevent memory leak
let noOfQuestions = 0
let givenTime = 60*60 //1 hr in secs
let currentTime = givenTime
let testDate
let timeTestStarted
let start_Prac_Card_Displayed = false

let is_ans_card_displayed = false
let is_view_quest_card_displayed = false
let is_result_card_displayed = false

export default function StartPrac({navigation}) {
    usePreventScreenCapture()
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
                        onPress: ()=> console.log('user said no')
                    }
                ]
            )
        }
        return true;
    });

    const is_token_obtained = useRef(false)
    
    function DISPLAY_BLOCKED_FEATURE_CARD(tokenPresent) {
            tokenPresent?setBLOCKED_FEATURE_CARD(
                <View style={styles.BLOCKED_FEATURE_CARD}>
                    <Text style={styles.BLOCKED_FEATURE_CARD_TEXT}>
                        This Feature Is Only Available To Paid Users.
                        Head To The Payment Section To Make Payment.
                    </Text>
                </View>
            ):
            setBLOCKED_FEATURE_CARD()
    }



    const [courseListState, setCourseListState] = useState()
    const [subjectListState, setSubjectListState] = useState()
    const [TimeListState, setTimeListState] = useState()
    const [pracCard, setPracCard] = useState()
    const [questViewCard, setquestViewCard] = useState()
    const [BLOCKED_FEATURE_CARD, setBLOCKED_FEATURE_CARD] = useState()

    const [resultState, setresultState] = useState()

    const [courseState, setCourseState] = useState('Course: ')
    const [subjectState, setSubjectState] = useState('Subject: All')
    const [enableTimer, setenableTimer] = useState('Timer: off')
    const [showTimerSettings, setshowTimerSettings] = useState({display: 'none'})
    const [timerState, settimerState] = useState('Select Time')
    const [option1Color, setoption1Color] = useState({backgroundColor: '#9c27b0'})
    const [option2Color, setoption2Color] = useState({backgroundColor: '#9c27b0'})
    const [option3Color, setoption3Color] = useState({backgroundColor: '#9c27b0'})
    const [option4Color, setoption4Color] = useState({backgroundColor: '#9c27b0'})

    const [questionDisplayed, setquestionDisplayed] = useState(0)

    const subjectNames = useRef([
        'Advanced Pure Mathematics',
        'Calculus',
        'Applied Mathematics',
        'Statistics'
    ])
    
    const displayCourseList = () => {
        setCourseListState(
            <View style={pageStyles.list}>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    pqPathObj.course = 'maths'
                    setCourseState('Course: Maths')
                    subjectNames.current = [
                        'Advanced Pure Mathematics',
                        'Calculus',
                        'Applied Mathematics',
                        'Statistics'
                    ]
                    pqPathObj.subject = 'All'
                    setSubjectState('Subject: All')
                    hideCourseList()
                }}>
                    <Text style={pageStyles.itemName}>Maths</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    pqPathObj.course = 'physics'
                    subjectNames.current = [
                        'MECHANICS AND PROPERTIES OF MATTER',
                        'HEAT, WAVES AND OPTICS',
                        'ELECTRICITY AND MAGNETISM',
                        'MODERN PHYSICS'
                    ]
                    pqPathObj.subject = 'All'
                    setSubjectState('Subject: All')
                    setCourseState('Course: Physics')
                    hideCourseList()
                }}>
                    <Text style={pageStyles.itemName}>Physics</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    pqPathObj.course = 'chemistry'
                    subjectNames.current = [
                        'General Chemistry',
                        'Physical Chemistry',
                        'Inorganic Chemistry',
                        'Organic Chemistry'
                    ]
                    pqPathObj.subject = 'All'
                    setSubjectState('Subject: All')
                    setCourseState('Course: Chemistry')
                    hideCourseList()
                }}>
                    <Text style={pageStyles.itemName}>Chemistry</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    pqPathObj.course = 'biology'
                    subjectNames.current = [
                        'General Biology',
                        'Microbiology',
                        'Basic Botany',
                        'Fundamental Of Zoology'
                    ]
                    pqPathObj.subject = 'All'
                    setSubjectState('Subject: All')
                    setCourseState('Course: Biology')
                    hideCourseList()
                }}>
                    <Text style={pageStyles.itemName}>Biology</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.cancelButn} onPress={hideCourseList}>
                    <Text style={pageStyles.listButnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function hideCourseList() {
        setCourseListState()
    }
    
    const displaySubjectList = () => {
        setSubjectListState(
            <View style={pageStyles.list}>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.subject = '001'
                    setSubjectState(`Subject: ${subjectNames.current[0]}`)
                    givenTime = 15
                    hideSubjectList()
                }}>
                    <Text style={pageStyles.itemName}>{subjectNames.current[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.subject = '002'
                    setSubjectState(`Subject: ${subjectNames.current[1]}`)
                    givenTime = 15
                    hideSubjectList()
                }}>
                    <Text style={pageStyles.itemName}>{subjectNames.current[1]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.subject = '003'
                    setSubjectState(`Subject: ${subjectNames.current[2]}`)
                    givenTime = 15
                    hideSubjectList()
                }}>
                    <Text style={pageStyles.itemName}>{subjectNames.current[2]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.subject = '004'
                    setSubjectState(`Subject: ${subjectNames.current[3]}`)
                    givenTime = 15
                    hideSubjectList()
                }}>
                    <Text style={pageStyles.itemName}>{subjectNames.current[3]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.subject = 'All'
                    setSubjectState('Subject: All')
                    givenTime = 60
                    hideSubjectList()
                }}>
                    <Text style={pageStyles.itemName}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.cancelButn} onPress={hideSubjectList}>
                    <Text style={pageStyles.listButnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function hideSubjectList() {
        setSubjectListState()
    }

    const displayTimeList = () => {
        setTimeListState(
            <View style={pageStyles.list}>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    settimerState('Time: 15mins')
                    givenTime = (15*60) //converts to secs
                    hideTimeList()
                }}>
                    <Text style={pageStyles.itemName}>15mins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    settimerState('Time: 30mins')
                    givenTime = (30*60) //converts to secs
                    hideTimeList()
                }}>
                    <Text style={pageStyles.itemName}>30mins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    settimerState('Time: 1hr')
                    givenTime = (60*60) //converts to secs
                    hideTimeList()
                }}>
                    <Text style={pageStyles.itemName}>1hr</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    settimerState('Time: 1hr 30mins')
                    givenTime = (90*60) //converts to secs
                    hideTimeList()
                }}>
                    <Text style={pageStyles.itemName}>1hr 30mins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    settimerState('Time: 2hrs')
                    givenTime = (120*60) //converts to secs0
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

    const displayPracCard = () => {
        testDate    = Date().substr(0, 24) //returns day month year and time
        //this is to ensure thet when a new section is selected the array will only load
        // the pictures in that new section and start from the beginging (setquestionDisplayed(0))
        //empty array 1st
        while(sectionToDisplayImgs.questions.length > 0) {
            sectionToDisplayImgs.questions.pop();
        }
        while(sectionToDisplayImgs.answers.length > 0) {
            sectionToDisplayImgs.answers.pop();
        }

        let questionsInSection = {
            questions: [],
            answers: []
        }

        if (pqPathObj.course != '') { //if the course has been selected
            if (pqPathObj.subject === 'All') { //check if user wants all subjects i.e 001 to 004
                images.forEach(img => {
                    if (img.key.includes(`../PastQuestions/${pqPathObj.course}/`) && img.key.includes('obj')) { //look for obj questions who are under the same course as the one in pqObject
                        if (img.key.includes(`questions`)) {
                            questionsInSection.questions.push(img)
                        } else if (img.key.includes(`answers`)) { //look for their answers
                            questionsInSection.answers.push(img)
                        }
                    }
                });
            } else { //else if user wants a particular subject
                images.forEach(img => {
                    if (img.key.includes(`../PastQuestions/${pqPathObj.course}/`) && img.key.includes(pqPathObj.subject) && img.key.includes('obj')) { //look for obj questions who are under the same course and subject as the one in pqObject
                        if (img.key.includes(`questions`)) {
                            questionsInSection.questions.push(img)
                        } else if (img.key.includes(`answers`)) { //look for their answers
                            questionsInSection.answers.push(img)
                        }
                    }
                });
            }

            fiterFunc(questionsInSection).then(makeGlobal({questNo: questNo, renderStartPracCard: renderStartPracCard}))
            timeTestStarted = new Date().getTime()
            
        } else {
            Alert.alert('', 'You Have Not Selected A course!')
        }
    }

    function genRandNum(questionsInSection) {
        let questionsToSelect = []
        let randomNum
        
        while(questionsToSelect.length > 0) { //empty the array
            questionsToSelect.pop();
        }

        while (noOfQuestions > questionsToSelect.length ) { //while it hasnt selected the requeired no. of questions keep genrating
            for (let i = 0; i < noOfQuestions; i++) {
                if (noOfQuestions > questionsToSelect.length) {// this is so that it dosent select more questions than its supposed to
                    randomNum = Math.ceil(Math.random()*questionsInSection.answers.length)
                    if (questionsInSection.answers[randomNum] != undefined) {
                        questionsToSelect = questionsToSelect.concat(randomNum)
                    }
                }
                
            }
            //removes duplicates
            questionsToSelect = [... new Set(questionsToSelect)]
        }
        return questionsToSelect
    }
    
    //this selects random questions to display
    function fiterFunc (questionsInSection) {
        if (pqPathObj.subject === 'All') { //this is to know how many questions to select from the unsorted array
            noOfQuestions = 50
        } else {
            noOfQuestions = 15
        }

        return new Promise((resolve) => {
            genRandNum(questionsInSection).forEach(questionNo => {
                sectionToDisplayImgs.questions = sectionToDisplayImgs.questions.concat(questionsInSection.questions[questionNo])
                sectionToDisplayImgs.answers = sectionToDisplayImgs.answers.concat(questionsInSection.answers[questionNo])
            });
            
            renderStartPracCard = true
            resolve()
            
        })
    }

    let questNo = questionDisplayed
    let timeVariable = null //this is to prevent memory leak
    function makeGlobal(data) {
        getToken(DISPLAY_BLOCKED_FEATURE_CARD)
        questNo = data.questNo //make questNo global
        timeVariable = timerState //make timerState global
        if (data.renderStartPracCard === true && sectionToDisplayImgs.questions.length != 0 && sectionToDisplayImgs.questions[questNo]) { // renders PracCard only when sectionToDisplayImgs is not empty and renderStartPracCard is true 
            startPrac()
            renderStartPracCard = false // this to prevent multiple renders
        }
    }
    
    const startPrac = () => {
        let path = sectionToDisplayImgs.questions[questNo].url.base64Url
        setPracCard(
            <View style={pageStyles.pqCard}>
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
                                    onPress: ()=> console.log('user said no')
                                }
                            ]
                        )
                    }} style={pageStyles.closePqCard}>
                        <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                    </TouchableOpacity>
                    <Text style={[pageStyles.timeDisplayed, {left: 25}]}>No. {questNo+1}</Text>
                    <View style={showTimerSettings}>
                        <Text style={pageStyles.timeDisplayed}>{timeVariable}</Text>
                    </View>
                </View>
                <View style={pageStyles.pqCont}>
                    <ScrollView style={pageStyles.vetScrol}>
                        <ScrollView horizontal={true} style={pageStyles.horiScrol}>
                            <Image style={pageStyles.questionImgStyle} source={sectionToDisplayImgs.questions[questNo].url}/>
                            <View style={pageStyles.padder}></View>
                        </ScrollView>
                    </ScrollView>
                    <View style={pageStyles.questOptionsContainer}>
                        <TouchableOpacity onPress={function () {
                            sectionToDisplayImgs.answers[questNo].userAns = 'A'
                            setoption1Color({backgroundColor: '#301934'})
                            setoption2Color({backgroundColor: '#9c27b0'})
                            setoption3Color({backgroundColor: '#9c27b0'})
                            setoption4Color({backgroundColor: '#9c27b0'})
                            renderStartPracCard = true
                        }} style={[pageStyles.questOptionsButn, {left: '5%'}, option1Color]}>
                            <Text style={pageStyles.questOptionsText}>A</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={function () {
                            sectionToDisplayImgs.answers[questNo].userAns = 'B'
                            setoption1Color({backgroundColor: '#9c27b0'})
                            setoption2Color({backgroundColor: '#301934'})
                            setoption3Color({backgroundColor: '#9c27b0'})
                            setoption4Color({backgroundColor: '#9c27b0'})
                            renderStartPracCard = true
                        }} style={[pageStyles.questOptionsButn, {left: '25%'}, option2Color]}>
                            <Text style={pageStyles.questOptionsText}>B</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={function () {
                            sectionToDisplayImgs.answers[questNo].userAns = 'C'
                            setoption1Color({backgroundColor: '#9c27b0'})
                            setoption2Color({backgroundColor: '#9c27b0'})
                            setoption3Color({backgroundColor: '#301934'})
                            setoption4Color({backgroundColor: '#9c27b0'})
                            renderStartPracCard = true
                        }} style={[pageStyles.questOptionsButn, {left: '45%'}, option3Color]}>
                            <Text style={pageStyles.questOptionsText}>C</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={function () {
                            sectionToDisplayImgs.answers[questNo].userAns = 'D'
                            setoption1Color({backgroundColor: '#9c27b0'})
                            setoption2Color({backgroundColor: '#9c27b0'})
                            setoption3Color({backgroundColor: '#9c27b0'})
                            setoption4Color({backgroundColor: '#301934'})
                            renderStartPracCard = true
                        }} style={[pageStyles.questOptionsButn, {left: '63%'}, option4Color]}>
                            <Text style={pageStyles.questOptionsText}>D</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={pageStyles.navigationCont}>
                        <TouchableOpacity style={pageStyles.previousButn} onPress={showPrev}>
                            <Image source={require('../icons/previous.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={pageStyles.nextButn} onPress={showNext}>
                            <Image source={require('../icons/next.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={pageStyles.ansButn} onPress={submit}>
                            <Text style = {pageStyles.ansButnText}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
        start_Prac_Card_Displayed = true
        if (!timerStarted && enableTimer === 'Timer: on') {
            startCountDown()
        }
    }

    function enableTimerFunc() {
        if (enableTimer === 'Timer: on') {
            setenableTimer('Timer: off');
            setshowTimerSettings({display: 'none'});
        } else {
            setenableTimer('Timer: on');
            setshowTimerSettings({display: 'flex'});
        }
    }
    
    function startCountDown() {
        currentTime = givenTime // updating current time in other to start counting
        timerStarted = true
        timerInterval = setInterval(() => {
            if (currentTime>0) {
                currentTime--
                renderStartPracCard = true //this is to re-render the PracCard to effect the change of settimerState
                settimerState(`Time: ${parseInt(currentTime/3600)}:${parseInt(currentTime/60)%60}:${(currentTime%60)}`) //hr:min:sec
            } else {
                submit()
            }
        }, 1000)
    }

    const showPrev = () => {
        if (sectionToDisplayImgs.questions[val-1]) { //if there is a question before the one that has an index of val
            val -=1
            if (sectionToDisplayImgs.answers[val].userAns === 'A') {
                setoption1Color({backgroundColor: '#301934'})
                setoption2Color({backgroundColor: '#9c27b0'})
                setoption3Color({backgroundColor: '#9c27b0'})
                setoption4Color({backgroundColor: '#9c27b0'})
            } else if (sectionToDisplayImgs.answers[val].userAns === 'B') {
                setoption1Color({backgroundColor: '#9c27b0'})
                setoption2Color({backgroundColor: '#301934'})
                setoption3Color({backgroundColor: '#9c27b0'})
                setoption4Color({backgroundColor: '#9c27b0'})
            } else if (sectionToDisplayImgs.answers[val].userAns === 'C') {
                setoption1Color({backgroundColor: '#9c27b0'})
                setoption2Color({backgroundColor: '#9c27b0'})
                setoption3Color({backgroundColor: '#301934'})
                setoption4Color({backgroundColor: '#9c27b0'})
            } else if (sectionToDisplayImgs.answers[val].userAns === 'D') {
                setoption1Color({backgroundColor: '#9c27b0'})
                setoption2Color({backgroundColor: '#9c27b0'})
                setoption3Color({backgroundColor: '#9c27b0'})
                setoption4Color({backgroundColor: '#301934'})
            } else {
                setoption1Color({backgroundColor: '#9c27b0'})
                setoption2Color({backgroundColor: '#9c27b0'})
                setoption3Color({backgroundColor: '#9c27b0'})
                setoption4Color({backgroundColor: '#9c27b0'})
            }
        } else {
            alert('You Are At The Beginning!')
        }
        renderStartPracCard = true
        setquestionDisplayed(val)
    }
    
    let val = questionDisplayed
    function showNext() {
        if (sectionToDisplayImgs.questions[val+1]) { //if there is a question after the one that has an index of val
            val +=1
            if (sectionToDisplayImgs.answers[val].userAns === 'A') {
                setoption1Color({backgroundColor: '#301934'})
                setoption2Color({backgroundColor: '#9c27b0'})
                setoption3Color({backgroundColor: '#9c27b0'})
                setoption4Color({backgroundColor: '#9c27b0'})
            } else if (sectionToDisplayImgs.answers[val].userAns === 'B') {
                setoption1Color({backgroundColor: '#9c27b0'})
                setoption2Color({backgroundColor: '#301934'})
                setoption3Color({backgroundColor: '#9c27b0'})
                setoption4Color({backgroundColor: '#9c27b0'})
            } else if (sectionToDisplayImgs.answers[val].userAns === 'C') {
                setoption1Color({backgroundColor: '#9c27b0'})
                setoption2Color({backgroundColor: '#9c27b0'})
                setoption3Color({backgroundColor: '#301934'})
                setoption4Color({backgroundColor: '#9c27b0'})
            } else if (sectionToDisplayImgs.answers[val].userAns === 'D') {
                setoption1Color({backgroundColor: '#9c27b0'})
                setoption2Color({backgroundColor: '#9c27b0'})
                setoption3Color({backgroundColor: '#9c27b0'})
                setoption4Color({backgroundColor: '#301934'})
            } else {
                setoption1Color({backgroundColor: '#9c27b0'})
                setoption2Color({backgroundColor: '#9c27b0'})
                setoption3Color({backgroundColor: '#9c27b0'})
                setoption4Color({backgroundColor: '#9c27b0'})
            }
        } else {
            alert('You Have Reached The End!')
        }
        renderStartPracCard = true
        setquestionDisplayed(val)
    }

    const closePracCard = () => {
        setqualityContButnDis({display: 'none'})
        start_Prac_Card_Displayed = false
        questNo = 0 //this is so that questions start from begining everytime PracCard is rerendered
        timerStarted  = false
        setPracCard()
        setquestionDisplayed(questNo)
        clearInterval(timerInterval)
        if (givenTime === (15*60)) {
            settimerState('Time: 15mins')
        } else if (givenTime === (30*60)) {
            settimerState('Time: 30mins')
        } else if (givenTime === (60*60)) {
            settimerState('Time: 1hr')
        } else if (givenTime === (90*60)) {
            settimerState('Time: 1hr 30mins')
        } else if (givenTime === (120*60)) {
            settimerState('Time: 2hr')
        }
        setoption1Color({backgroundColor: '#9c27b0'})
        setoption2Color({backgroundColor: '#9c27b0'})
        setoption3Color({backgroundColor: '#9c27b0'})
        setoption4Color({backgroundColor: '#9c27b0'})
        renderStartPracCard = false
    }
    
    function submit() {
        let score = 0
        submitted = true
        let noOfQuestionsAttempted = 0
        sectionToDisplayImgs.answers.forEach((ans) => {
            if (ans) {
                if (ans.correctAns === ans.userAns || ans.correctAns === 'N/A' && ans.userAns != '') { // if user got the answer or if there is no correct option but th user attempted the question
                    score++
                }
                
                if (ans.userAns != '') { //if user attempted question
                    noOfQuestionsAttempted++
                }
            } 
        });
        is_result_card_displayed = true
        setresultState(
            <View style={pageStyles.pqCard}>
                <View style={pageStyles.pqHeader}>
                    <View style={{display: 'flex'}}>
                        <Text style={[pageStyles.timeDisplayed]}>You Scored: {score}/{sectionToDisplayImgs.answers.length}</Text>
                    </View>
                    <TouchableOpacity onPress = {closeResultArea} style={pageStyles.closePqCard}>
                        <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                    </TouchableOpacity>
                </View>
                <SafeAreaView style={{flex: 1}}>
                    <FlatList
                        data={sectionToDisplayImgs.answers}
                        contentContainerStyle = {{paddingBottom: 200}}
                        renderItem={({item}) => (
                            <TouchableOpacity style={pageStyles.questionStatusBar} onPress={() => {viewQuest(sectionToDisplayImgs.answers.indexOf(item))}}>
                                <Text style={pageStyles.answerNo}>{item && sectionToDisplayImgs.answers.indexOf(item)+1}</Text>
                                <Text style={pageStyles.correctAnswer}>Correct Ans: {item && item.correctAns}</Text>
                                <Text style={pageStyles.userAns}>Your Ans: {item && item.userAns}</Text>
                            </TouchableOpacity> 
                        )}
                    />
                </SafeAreaView>
            </View>
        )

        saveTestData({
            testDate,
            score,
            course: pqPathObj.course,
            noOfQuestions,
            noOfQuestionsAttempted,
            timeTaken: Math.ceil((new Date().getTime() - timeTestStarted)/1000), //converts to sec
        })
    }
    
    function closeResultArea() {
        closePracCard()
        setresultState()
        is_result_card_displayed = false
    }

    const saveTestData = async testdata => {
        try {
            await AsyncStorage.setItem(testDate, JSON.stringify(testdata))
        } catch (error) {
            console.log(error);
        }
    }

    const subjectNameToDisplay = {
        maths: {
            "001" : 'Advanced Pure Mathematics',
            "002": 'Calculus',
            "003": 'Applied Mathematics',
            "004": 'Statistics'
        }, 

        physics: {
            "001" :'MECHANICS AND PROPERTIES OF MATTER',
            "002": 'HEAT, WAVES AND OPTICS',
            "003": 'ELECTRICITY AND MAGNETISM',
            "004": 'MODERN PHYSICS'
        },

        chemistry: {
            "001" :'General Chemistry',
            "002": 'Physical Chemistry',
            "003": 'Inorganic Chemistry',
            "004": 'Organic Chemistry'
        },

        biology: {
            "001" :'General Biology',
            "002": 'Microbiology',
            "003": 'Basic Botany',
            "004": 'Fundamental Of Zoology'
        }
    }
    

    const viewQuest = questIndex => {
      let questName = sectionToDisplayImgs.questions[questIndex].key.split('/')
      questName = `Year: ${questName[3]}, Subject: ${subjectNameToDisplay[questName[2]][questName[4]].slice(0, 10)}..., No: ${questIndex+1}`
      is_view_quest_card_displayed = true
      setqualityContButnDis({display: 'flex'})
      setquestViewCard(
        <View style={pageStyles.pqCard}>
            <View style={pageStyles.pqHeader}>
                <Text style={[pageStyles.pqHeaderText]}>{questName}</Text>
                <TouchableOpacity onPress = {closeViewQuestCard} style={pageStyles.closePqCard}>
                    <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                </TouchableOpacity>
            </View>
            <View style={pageStyles.pqCont}>
                <ScrollView style={pageStyles.vetScrol}>
                    <ScrollView horizontal={true} style={pageStyles.horiScrol}>
                        <Image style={pageStyles.questionImgStyle} source={sectionToDisplayImgs.questions[questIndex].url}/>
                        <View style={pageStyles.padder}></View>
                    </ScrollView>
                </ScrollView>
                <View style={pageStyles.navigationCont}>
                    <TouchableOpacity style={[pageStyles.ansButn]} onPress={() => {showAns(questIndex)}}>
                        <Text style = {pageStyles.ansButnText}>SHOW ANS</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      )
    }

    const closeViewQuestCard = () => {setqualityContButnDis({display: 'none'}); setquestViewCard(); is_view_quest_card_displayed = false}

    const [ansPage, setansPage] = useState()
    const showAns = ansIndex => {
        let answerName = sectionToDisplayImgs.answers[ansIndex].key.split('/')
        answerName = `Year: ${answerName[3]}, Subject: ${subjectNameToDisplay[answerName[2]][answerName[4]].slice(0, 10).replace(' ',  '')}..., No: ${ansIndex+1}`
        is_ans_card_displayed = true
        setansPage(
            <View style={pageStyles.pqCard}>
                <View style={pageStyles.pqHeader}>
                    <Text style={[pageStyles.pqHeaderText]}>{answerName}</Text>
                    <TouchableOpacity onPress = {closeAnsPage} style={pageStyles.closePqCard}>
                        <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={pageStyles.pqCont}>
                    <ScrollView style={pageStyles.vetScrol}>
                        <ScrollView horizontal={true} style={pageStyles.horiScrol}>
                            <Image style={pageStyles.questionImgStyle} source={sectionToDisplayImgs.answers[ansIndex].url}/>
                            <View style={pageStyles.padder}></View>
                        </ScrollView>
                    </ScrollView>
                </View>
            </View>
          )
    }
    
    const closeAnsPage = () => {setansPage(); is_ans_card_displayed = false}

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
                        `Do You Find A Problem With This Question? \nContact our Admin on \nWhatsAapp To lay complains`,
                        [
                                {
                                    text: 'YES',
                                    onPress: ()=> Linking.openURL(`https://wa.me/+2348067124123?text=Good%20Day%20Admin%20I%20contacted%20you%20from%20JUPEB%20STUDY%20APP`)
                                }, 

                                {
                                    text: 'NO',
                                    onPress: ()=> console.log('Do nothing'),
                                    style: 'cancel'
                                },

                            ]
                        )
                }}>
                    <Image style={pageStyles.qualityContButnImg} resizeMode={'center'} source={require('../icons/info.png')}/>
                </TouchableOpacity>
            </View>
            <View style={pageStyles.listOptionsCont}>
                <TouchableOpacity style={pageStyles.listOptions} onPress = {displayCourseList}>
                    <Text style={pageStyles.listOptionsText}>{courseState}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.listOptions} onPress = {displaySubjectList}>
                    <Text style={pageStyles.listOptionsText}>{subjectState}</Text>
                </TouchableOpacity>
                <View style={pageStyles.timerCont}>
                    <TouchableOpacity onPress={displayTimeList} style={[pageStyles.timeBox, showTimerSettings]}>
                        <Text style={pageStyles.time}>{timerState}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={enableTimerFunc} style = {pageStyles.enableTimerButn}>
                        <Text style = {pageStyles.enableTimerText}>{enableTimer}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {BLOCKED_FEATURE_CARD}
            {courseListState}
            {subjectListState}
            {TimeListState}
            {pracCard}
            {resultState}
            {questViewCard}
            {ansPage}
            {makeGlobal({questNo: questionDisplayed, renderStartPracCard: renderStartPracCard})}
            <TouchableOpacity style={pageStyles.startButn} onPress={displayPracCard}>
                <Text style={pageStyles.startText}>Start</Text>
            </TouchableOpacity>
            <StatusBar style="light" />
        </SafeAreaView>
    )
}