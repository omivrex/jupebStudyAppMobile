import React, {useState, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MathJax from 'react-native-mathjax';

import {
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Alert,
    Linking,
    ScrollView,
    BackHandler} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { usePreventScreenCapture } from 'expo-screen-capture'
import styles from '../styles/master.js';
import pageStyles from '../styles/pqScreenStyles.js';
const {images} = require("../Scripts/imageUrl.js");
import * as FileSystem from 'expo-file-system';

const sectionToDisplayImgs = {
    questions: [],
    answers: [],
}

let renderPqCard = false
let pqCardDisplayed = false
let IS_ANS_CARD_DISPLAYED = false
let token = false

 
// TODO: What to do with the module?
export default function pqScreen({navigation}) {
    usePreventScreenCapture()
    const [courseListState, setCourseListState] = useState()
    const [yearListState, setYearListState] = useState()
    const [subjectListState, setSubjectListState] = useState()
    const [sectionListState, setSectionListState] = useState()
    const [pqCardState, setPqCardState] = useState()
    const [BLOCKED_FEATURE_CARD, setBLOCKED_FEATURE_CARD] = useState()
    
    const [courseState, setCourseState] = useState('Course: ')
    const [yearState, setYearState] = useState('Year: ')
    const [subjectState, setSubjectState] = useState('Subject: All')
    const [sectionState, setSectionState] = useState('Section: All')
    const IS_BLOCKED_FEATURE_CARD_DISPLAYED = useRef(false)
    
    const IS_GET_TOKEN_CALLED = useRef(false)
    
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
                    pqPathObj.current.course = 'maths'
                    setCourseState('Course: Maths')
                    subjectNames.current = [
                        'Advanced Pure Mathematics',
                        'Calculus',
                        'Applied Mathematics',
                        'Statistics'
                    ]
                    pqPathObj.current.subject = 'All'
                    setSubjectState('Subject: All')
                    hideCourseList()
                }}>
                    <Text style={pageStyles.itemName}>Maths</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    pqPathObj.current.course = 'physics'
                    subjectNames.current = [
                        'MECHANICS AND PROPERTIES OF MATTER',
                        'HEAT, WAVES AND OPTICS',
                        'ELECTRICITY AND MAGNETISM',
                        'MODERN PHYSICS'
                    ]
                    pqPathObj.current.subject = 'All'
                    setSubjectState('Subject: All')
                    setCourseState('Course: Physics')
                    hideCourseList()
                }}>
                    <Text style={pageStyles.itemName}>Physics</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    pqPathObj.current.course = 'chemistry'
                    subjectNames.current = [
                        'General Chemistry',
                        'Physical Chemistry',
                        'Inorganic Chemistry',
                        'Organic Chemistry'
                    ]
                    pqPathObj.current.subject = 'All'
                    setSubjectState('Subject: All')
                    setCourseState('Course: Chemistry')
                    hideCourseList()
                }}>
                    <Text style={pageStyles.itemName}>Chemistry</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    pqPathObj.current.course = 'biology'
                    subjectNames.current = [
                        'General Biology',
                        'Microbiology',
                        'Basic Botany',
                        'Fundamental Of Zoology'
                    ]
                    pqPathObj.current.subject = 'All'
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
    
    const displayYearList = () => {
        setYearListState(
            <View style={pageStyles.list}>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    pqPathObj.current.year = '2020'
                    setYearState('Year: 2020')
                    hideYearList()
                }}>
                    <Text style={pageStyles.itemName}>2020</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    pqPathObj.current.year = '2019'
                    setYearState('Year: 2019')
                    hideYearList()
                }}>
                    <Text style={pageStyles.itemName}>2019</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress={() => {
                    pqPathObj.current.year = '2018'
                    setYearState('Year: 2018')
                    hideYearList()
                }}>
                    <Text style={pageStyles.itemName}>2018</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.cancelButn} onPress={hideYearList}>
                    <Text style={pageStyles.listButnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function hideYearList() {
        setYearListState()
    }

    const displaySubjectList = () => {
        setSubjectListState(
            <View style={pageStyles.list}>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.current.subject = '001'
                    setSubjectState(`Subject: ${subjectNames.current[0]}`)
                    hideSubjectList()
                }}>
                    <Text style={pageStyles.itemName}>{subjectNames.current[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.current.subject = '002'
                    setSubjectState(`Subject: ${subjectNames.current[1]}`)
                    hideSubjectList()
                }}>
                    <Text style={pageStyles.itemName}>{subjectNames.current[1]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.current.subject = '003'
                    setSubjectState(`Subject: ${subjectNames.current[2]}`)
                    hideSubjectList()
                }}>
                    <Text style={pageStyles.itemName}>{subjectNames.current[2]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.current.subject = '004'
                    setSubjectState(`Subject: ${subjectNames.current[3]}`)
                    hideSubjectList()
                }}>
                    <Text style={pageStyles.itemName}>{subjectNames.current[3]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.current.subject = 'All'
                    setSubjectState('Subject: All')
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

    const displaySectionList = () => {
        setSectionListState(
            <View style={pageStyles.list}>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.current.section = 'obj'
                    setSectionState('Section: Objective')
                    hideSectionList()
                }}>
                    <Text style={pageStyles.itemName}>Objective</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.current.section = 'theory'
                    setSectionState('Section: Theory')
                    hideSectionList()
                }}>
                    <Text style={pageStyles.itemName}>Theory</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.items} onPress ={() => {
                    pqPathObj.current.section = 'All'
                    setSectionState('Section: All')
                    hideSectionList()
                }}>
                    <Text style={pageStyles.itemName}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.cancelButn} onPress={hideSectionList}>
                    <Text style={pageStyles.listButnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function hideSectionList() {
        setSectionListState()
    }

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
       if (data.renderPqCard === true && sectionToDisplayImgs.questions.length != 0) {
        pqCardRender()
        renderPqCard = false // this to prevent multiple renders
        setqualityContButnDis({display: 'flex'})
       }
    }
    
    const displayPqCard = () => {
        //this is to ensure thet when a new section is selected the array will only load
        //the pictures in that new section and start from the beginging (setquestionDisplayed(0))
        //empty array 1st
        while(sectionToDisplayImgs.questions.length > 0) {
            sectionToDisplayImgs.questions.pop();
        }
        while(sectionToDisplayImgs.answers.length > 0) {
            sectionToDisplayImgs.answers.pop();
        }

        let unsortedQuestArray = {
            questions: [],
            answers: []
        }

        if (pqPathObj.current.course != '' && pqPathObj.current.year != '') { //if the year and course has been selected
            if (pqPathObj.current.subject === 'All') { //check if user wants all subjects i.e 001 to 004
                if (pqPathObj.current.section === 'All') { //check if user wants all sections i.e obj and theory
                    images.forEach(img => {
                        if (img.key.includes(`../PastQuestions/${pqPathObj.current.course}/${pqPathObj.current.year}/`)) { //if img.key has the same course and year and is under questions
                            if (img.key.includes('questions')) {
                                unsortedQuestArray.questions.push(img)
                            } else if (img.key.includes('answers')) { //if img.key has the same course and year and is under answers
                                unsortedQuestArray.answers.push(img)
                            }
                        }
                    });
                } else { //else select questions and answers under the user section
                    images.forEach(img => {
                        if (img.key.includes(`../PastQuestions/${pqPathObj.current.course}/${pqPathObj.current.year}/`) && img.key.includes(pqPathObj.current.section)) { //if img.key has the same course and year and under the selected section and is under questions
                            if (img.key.includes(`questions`)) {
                                unsortedQuestArray.questions.push(img)
                            } else if (img.key.includes(`answers`)) { //if img.key has the same course and year and under the selected section and is under answers
                                unsortedQuestArray.answers.push(img)
                            }
                        }
                    });
                }
            } else { //else if user wants a particular subject check what section he wants
                if (pqPathObj.current.section === 'All') { //check if user wants all sections i.e obj and theory
                    images.forEach(img => {
                        if (img.key.includes(`../PastQuestions/${pqPathObj.current.course}/${pqPathObj.current.year}/${pqPathObj.current.subject}`)) { //if img.key has the same course and year and is under questions
                            if (img.key.includes(`questions`)) {
                                unsortedQuestArray.questions.push(img)
                            } else if (img.key.includes(`answers`)) { //if img.key has the same course and year and is under answers
                                unsortedQuestArray.answers.push(img)
                            }
                        }
                    });
                } else {  //else select questions and answers under the usr section
                    images.forEach(img => {
                        if (img.key.includes(`../PastQuestions/${pqPathObj.current.course}/${pqPathObj.current.year}/${pqPathObj.current.subject}/${pqPathObj.current.section}`)) { //if img.key has the same course and year and under the selected section and is under questions
                            if (img.key.includes(`questions`)) {
                                unsortedQuestArray.questions.push(img)
                            } else if (img.key.includes(`answers`)) { //if img.key has the same course and year and under the selected section and is under answers
                                unsortedQuestArray.answers.push(img)
                            }
                        }
                    });
                }
            }
            console.log(unsortedQuestArray.questions.length);
            sortFunc(unsortedQuestArray)
        } else {
            Alert.alert('', 'You Must Select A Course And A Year!')
        }
    }
    
    async function sortFunc (unsortedArray) {
        unsortedArray.questions.forEach(question => { //find all obj questions and push it 1st
            if (question.key.indexOf('obj') != -1) {
                sectionToDisplayImgs.questions.push(question)
            }
        });
        
        unsortedArray.questions.forEach(question => {
            if (question.key.indexOf('theory') != -1) {
                sectionToDisplayImgs.questions.push(question)
            }
        });
        
        unsortedArray.answers.forEach(answer => { //find all obj answers and push it 1st
            if (answer.key.indexOf('obj') != -1) {
                sectionToDisplayImgs.answers.push(answer)
            }
        });
        
        unsortedArray.answers.forEach(answer => {
            if (answer.key.indexOf('theory') != -1) {
                sectionToDisplayImgs.answers.push(answer)
            }
        });
        renderPqCard = true
        makeGlobal({questNo: questNo, renderPqCard: renderPqCard})
    }

    const [questionDisplayed, setquestionDisplayed] = useState(0)

    const showPrev = () => {
        if (sectionToDisplayImgs.questions[val-1]) {
            val -=1
        } else {
            Alert.alert('', 'You Are At The Beginning Of This Section!')
        }
        renderPqCard = true
        setquestionDisplayed(val)
    }
    
    let val = questionDisplayed
    function showNext() {
        if (sectionToDisplayImgs.questions[val+1]) {
            val +=1
        } else {
            Alert.alert('', 'You Have Reached The End Of This Section!')
        }
        renderPqCard = true
        setquestionDisplayed(val)
    }

    const pqCardRender = () => {
        let questionHeader = `${pqPathObj.current.course}/${pqPathObj.current.year}/${subjectState.replace('Subject: ', '').slice(0, 10)}.../${pqPathObj.current.section}/`
        setPqCardState(
            <View style={pageStyles.pqCard}>
                <View style={pageStyles.pqHeader}>
                    <Text style={[pageStyles.pqHeaderText, {left: wp('3%')}]}>{questionHeader}</Text>
                    <TouchableOpacity onPress = {closePqCard} style={pageStyles.closePqCard}>
                        <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                    </TouchableOpacity>
                </View>
                    <MathJax
                        html={
                            `<body style="background-color: red; overflow: hidden; width: 100vw;">
                                <p style="color: #eee; width: 100%; height: 100%; display: flex; overflow-wrap: break-word; word-wrap: break-word; overflow: hidden">
                                    $\\:{the}\\:{diagram}\\:{above}\\:{we}\\:{can}\\:{see}\\:{that}\\
                                    :{there}\\:{is}\\:{an}\\:{increase}\\:{by}\\:\\mathrm{2}^{{x}}
                                     +\\mathrm{3}{x}^{\\mathrm{2}} .\\:\\:{equating}\\:{this}\\:{to}
                                     \\:{the}\\:{initial}\\:{vale}\\:{v}^{{o}} \\:{we}\\:{jave}\\:{hnt} \\ $
                                </p>
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
                        style={{height: '30%', width: '100%'}}
                    
                    />
                <View style={[pageStyles.pqCont, {backgroungColor: 'red'}]}>
                    {/* <ScrollView style={pageStyles.vetScrol}>
                        <ScrollView horizontal={true} style={pageStyles.horiScrol}>
                            <Image style={pageStyles.questionImgStyle} source={sectionToDisplayImgs.questions[questNo].url}/>
                            <View style={pageStyles.padder}></View>
                        </ScrollView>
                    </ScrollView> */}
                    <View style={pageStyles.navigationCont}>
                        <TouchableOpacity style={pageStyles.previousButn} onPress={showPrev}>
                            <Image source={require('../icons/previous.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={pageStyles.nextButn} onPress={showNext}>
                            <Image source={require('../icons/next.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={pageStyles.ansButn} onPress={showAns}>
                            <Text style = {pageStyles.ansButnText}>ANSWER</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
        pqCardDisplayed = true
    }
    

    const closePqCard = () => {
        setqualityContButnDis({display: 'none'})
        setPqCardState()
        questNo = 0 //this is so that questions start from begining everytime pqCard is rerendered
        setquestionDisplayed(questNo)
        pqCardDisplayed = false
        renderPqCard = false
    }

    const [ansCard, setansCard] = useState()
    const showAns = () => {
      let questionHeader = sectionToDisplayImgs.answers[questNo].key
      questionHeader = questionHeader.slice(questionHeader.indexOf('/', 4)+1, questionHeader.indexOf('/answers'))
      let path = sectionToDisplayImgs.answers[questNo].url.base64Url
      setansCard(
        <View style={pageStyles.pqCard}>
            <View style={pageStyles.pqHeader}>
                <Text style={pageStyles.pqHeaderText}>{questionHeader}</Text>
                <TouchableOpacity onPress = {closeAnsPage} style={pageStyles.closePqCard}>
                    <Image resizeMode={'center'} source={require('../icons/back.png')}/>
                </TouchableOpacity>
            </View>
            <View style={pageStyles.pqCont}>
                <ScrollView style={pageStyles.vetScrol}>
                    <ScrollView horizontal={true} style={pageStyles.horiScrol}>
                        <Image style={pageStyles.questionImgStyle} source={sectionToDisplayImgs.answers[questNo].url}/>
                        <View style={pageStyles.padder}></View>
                    </ScrollView>
                </ScrollView>
                {/* <WebView style={{position: 'relative', alignSelf: 'center', width: '100%', height: '100%', paddingBottom: 200}} source={{
                    html: 
                        `<!DOCTYPE html>
                        <html lang="en" dir="ltr">
                        <head>
                            <meta charset="utf-8">
                            <title></title>
                        </head>
                        <body style="display: flex; flex: 3;">
                            <img style="margin: auto; max-height: 100%; height: -webkit-fill-available; align-self: center; postion: relative; margin-top: 10px" src="data:image/jpg;base64,${path}" alt="">
                        </body>
                        </html>`
                }} /> */}
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
                <TouchableOpacity style={[pageStyles.qualityContButn, qualityContButnDis]} onPress={() => {
                        Alert.alert('Quality Control Service',
                            `Do You Find A Problem With This Question? \\nContact our Admin on \\nWhatsAapp To lay complains`,
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
                <TouchableOpacity style={pageStyles.listOptions} onPress = {displayYearList}>
                    <Text style={pageStyles.listOptionsText}>{yearState}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.listOptions} onPress = {displaySubjectList}>
                    <Text style={pageStyles.listOptionsText}>{subjectState}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={pageStyles.listOptions} onPress = {displaySectionList}>
                    <Text style={pageStyles.listOptionsText}>{sectionState}</Text>
                </TouchableOpacity>
            </View>

            {courseListState}
            {yearListState}
            {subjectListState}
            {sectionListState}
            {pqCardState}
            {ansCard}
            {BLOCKED_FEATURE_CARD}
            {makeGlobal({questNo: questionDisplayed, renderPqCard: renderPqCard})}

            <TouchableOpacity style={pageStyles.startButn} onPress={displayPqCard}>
                <Text style={pageStyles.startText}>Start</Text>
            </TouchableOpacity>
            <StatusBar style="light" />
        </SafeAreaView>

    )
}   
