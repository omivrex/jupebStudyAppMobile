import React, {useState, useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { getToken, getQuestionData } from "../utils/pastquestions.utils";
import {
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
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
const pqData = require("../Scripts/pqData.json");
import styles from '../styles/master.js';
import { FlatList } from 'react-native-gesture-handler';

const sectionToDisplayImgs = {
    questions: [],
    answers: [],
}

let renderStartPracCard = false
let timerStarted  = false;
let submitted = false
let timerInterval = null // this is to prevent memory leak
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
            !tokenPresent?setBLOCKED_FEATURE_CARD(
                <View style={styles.BLOCKED_FEATURE_CARD}>
                    <Text style={styles.BLOCKED_FEATURE_CARD_TEXT}>
                        This Feature Is Only Available To Paid Users.
                        Head To The Payment Section To Make Payment.
                    </Text>
                </View>
            ):
            setBLOCKED_FEATURE_CARD()
    }



    const [options, setOptions] = useState()
    const [TimeListState, setTimeListState] = useState()
    const [pracCard, setPracCard] = useState()
    const [questViewCard, setquestViewCard] = useState()
    const [BLOCKED_FEATURE_CARD, setBLOCKED_FEATURE_CARD] = useState()
    const [resultState, setresultState] = useState()

    const [option1Color, setoption1Color] = useState({backgroundColor: '#9c27b0'})
    const [option2Color, setoption2Color] = useState({backgroundColor: '#9c27b0'})
    const [option3Color, setoption3Color] = useState({backgroundColor: '#9c27b0'})
    const [option4Color, setoption4Color] = useState({backgroundColor: '#9c27b0'})

    const [questionDisplayed, setquestionDisplayed] = useState(0)

    const optionsRef = useRef([])
    const label = useRef('')
    const pathObj = useRef({
        course: '',
        subject: 'All',
    })
    useEffect(() => {
        getToken(DISPLAY_BLOCKED_FEATURE_CARD)
        getCourses()
    }, [])

    const getCourses = () => {
        const optionsArray = []
        selectedSubject.current = 'Subject'
        pathObj.current.subject = ''
        pqData.forEach(item => {
            label.current = 'Course'
            optionsArray.push(item['courseName'])
        });
        optionsRef.current = [... optionsArray]
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
        console.log(pathObj.current)
    }
    
    const selectedCourse = useRef('Course: ')
    const selectedSubject = useRef('Subject: ')
    const displayOptions = labelName => {
        if(labelName==='Course') {
            getCourses()
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
                                if (labelName==='Course') {
                                    pathObj.current.course = item
                                    selectedCourse.current = `${label.current}: ${item.toUpperCase()}`
                                    getSubjects(item)
                                } else {
                                    pathObj.current.subject = item
                                    selectedSubject.current = `${label.current}: ${item.toUpperCase()}`
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
    let currentTime = givenTime.current
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

    const displayPracCard = () => {
        testDate = Date().substr(0, 24) //returns day month year and time
        
        let selectedQuestions = []
        
        console.log(pathObj.current)
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
                                        console.log(subject.subject)
                                        subject.content.forEach(section => {
                                            section.section=== 'Objective'? selectedQuestions = selectedQuestions.concat(section.content):''
                                        });
                                    }
                                }
                            });
                        });
                    }
                });
                // console.log(selectedQuestions)

            fiterFunc(selectedQuestions).then(questionsToDisplay=> {
                console.log('questionsToDisplay.length', questionsToDisplay.length)
            })
            // timeTestStarted = new Date().getTime()
            
        } else {
            Alert.alert('', 'You Have Not Selected A course!')
        }
    }

    function genRandNum(questionsInSection, noOfQuestionsToSelect) {
        let indexesToSelect = []
        let randomNum
        
        while (noOfQuestionsToSelect > indexesToSelect.length ) { //while it hasnt selected the requeired no. of questions keep genrating
            for (let i = 0; i < noOfQuestionsToSelect; i++) {
                randomNum = Math.ceil(Math.random()*questionsInSection.length)
                indexesToSelect.push(randomNum)
            }
            indexesToSelect = [... new Set(indexesToSelect)]
        }
        // console.log(indexesToSelect, indexesToSelect.length, noOfQuestionsToSelect)
        return indexesToSelect
    }
    
    //this selects random questions to display
    const noOfQuestions = useRef(0)

    function fiterFunc (questionsInSection) {
        if (pathObj.current.subject === 'ALL') { //this is to know how many questions to select from the unsorted array
            noOfQuestions.current = 50
        } else {
            noOfQuestions.current = 15
        }

        const questionsToDisplay = []

        return new Promise((resolve) => {
            genRandNum(questionsInSection, noOfQuestions.current).forEach(questionNo => {
                questionsToDisplay.push(questionsInSection[questionNo])
            });
            renderStartPracCard = true
            resolve(questionsToDisplay)
        })
    }

    let questNo = questionDisplayed
    let timeVariable = null //this is to prevent memory leak
    function makeGlobal(data) {
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
        if (!timerStarted && enableTimerButnValue.current === 'Timer: on') {
            startCountDown()
        }
    }

    function startCountDown() {
        currentTime = givenTime.current // updating current time in other to start counting
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
            course: pathObj.current.course,
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
                    <TouchableOpacity style={pageStyles.startButn} onPress={displayPracCard}>
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
            {/* {makeGlobal({questNo: questionDisplayed, renderStartPracCard: renderStartPracCard})} */}
            <StatusBar style="light" />
        </SafeAreaView>
    )
}