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
                            `<html><head><meta content="text/html; charset=UTF-8" http-equiv="content-type">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                            <style type="text/css">
                            *{overflow: hidden !important;}
                            body{background: red !important; width: fit-content !important; height: fit-content !important}
                            ol{margin:0;padding:0}table td,table th{padding:0}.c4{color:#000000;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:11pt;font-family:"Arial";font-style:normal}.c1{padding-top:0pt;padding-bottom:0pt;line-height:1.15;orphans:2;widows:2;text-align:left}.c0{background-color:#ffffff;font-size:10.5pt;font-family:"Roboto";color:#333333;font-weight:400}.c5{background-color:#ffffff;font-size:8pt;font-family:"Roboto";color:#333333;font-weight:400}.c2{background-color:#ffffff;max-width:468pt;padding:72pt 72pt 72pt 72pt}.c3{height:11pt}.title{padding-top:0pt;color:#000000;font-size:26pt;padding-bottom:3pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}.subtitle{padding-top:0pt;color:#666666;font-size:15pt;padding-bottom:16pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}li{color:#000000;font-size:11pt;font-family:"Arial"}p{margin:0;color:#000000;font-size:11pt;font-family:"Arial"}h1{padding-top:20pt;color:#000000;font-size:20pt;padding-bottom:6pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h2{padding-top:18pt;color:#000000;font-size:16pt;padding-bottom:6pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h3{padding-top:16pt;color:#434343;font-size:14pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h4{padding-top:14pt;color:#666666;font-size:12pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h5{padding-top:12pt;color:#666666;font-size:11pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h6{padding-top:12pt;color:#666666;font-size:11pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;font-style:italic;orphans:2;widows:2;text-align:left}</style></head><body class="c2"><p class="c1"><span>This is a random document that will be converted to html and has an image which we will use this document to test our app. </span><span class="c0">&int; 8 x</span><span class="c5">3</span><span class="c0">&nbsp;dx = 8 &int; x</span><span class="c5">3</span><span class="c0">&nbsp;dx</span></p><p class="c1 c3"><span class="c4"></span></p><p class="c1"><span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 624.00px; height: 569.33px;"><img alt="" src="data:image/jpeg;base64,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PibSk0vxC1rqEcyW14mCty+1jtUs2MnAA3nNb/7efxh0r4j23gvwfo3iXTJtH17VlGtXNjfxSJbwq0YHmspIVfnZ/mIH7sHtTlh6uihFtt22631foKMottva1/la9vXoep6n/wAFAvhFpN/JayeMIZHhOGaGwupoyfZ0iKt9QSKK9Y8D/sbRaF4B0WTRfhpO3h/ULOK7028i0BpodQgdA0c6SbCJVdSGEgJ3Ag5OaKzlFp2DmPybooor9KPJCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKLBcKKKKLILsKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooopWQ+ZhRRRTshXCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooopDP6Of2LL+bUP2Mfg88zNMyeBtDiXJ6KunwKo/AACio/2Hf+TL/hD/ANiTo3/pDDRX59iP4kvU7Y7H85VFFFfoRwhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRRcAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACip7Sz86NpJJPKhQgFiMkk9gO5p/kWP8Az3uv/Adf/i6AKtFWvIsf+e91/wCA6/8AxdHkWP8Az3uv/Adf/i6AKtFXEsre5bZDcSGRuFWWIIGPpkMf1qmwKnB4I4IPagAooooA/o1/Yd/5Mv8AhD/2JOjf+kMNFH7Dv/Jl/wAIf+xJ0b/0hhor89xH8SXqd0dj+cqiiiv0I4QooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD9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Pj210nxHa6b4QtfDOuQx7pLO92WyxShCwVihIO0kK3Q4B6cL/wAEz/2E/EX7C1r8UtO13xYfGVp4q8UjVNGv7iWSS/Fgllb20Md0WUZmRYQhYFgwQMSCxUehUl/tE30s0n5c0Xb5Jfd6HOo/uYvrdNrzs038/wCtz6gooorMoKKKKACiiigAooooAKKKKAMib/j6k/3j/Oiib/j6k/3j/OiuM6DXooorsOcKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMib/AI+pP94/zoom/wCPqT/eP86K4zoNeiiiuw5wooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAyJv+PqT/eP86KJv+PqT/eP86K4zoNeiiiuw5wooooAKQ+BNL1n/AEm4tfMmk+83muuccDgHHQClrW07/kHx/j/M1lV2NKe5k/8ACr9D/wCfH/yNJ/8AFUf8Kv0P/nx/8jSf/FV0FFYGhz//AAq/Q/8Anx/8jSf/ABVH/Cr9D/58f/I0n/xVdBmigDn/APhV+h/8+P8A5Gk/+Ko/4Vfof/Pj/wCRpP8A4qugooA5/wD4Vfof/Pj/AORpP/iqP+FX6H/z4/8AkaT/AOKroKKAOf8A+FX6H/z4/wDkaT/4qj/hV+h/8+P/AJGk/wDiq6CigDn/APhV+h/8+P8A5Gk/+Ko/4Vfof/Pj/wCRpP8A4qugooA5/wD4Vfof/Pj/AORpP/iqP+FX6H/z4/8AkaT/AOKroKKAOf8A+FX6H/z4/wDkaT/4qj/hV+h/8+P/AJGk/wDiq6CigDn/APhV+h/8+P8A5Gk/+Ko/4Vfof/Pj/wCRpP8A4qugooA5/wD4Vfof/Pj/AORpP/iqP+FX6H/z4/8AkaT/AOKroKKAOf8A+FX6H/z4/wDkaT/4qj/hV+h/8+P/AJGk/wDiq6CigDn/APhV+h/8+P8A5Gk/+Ko/4Vfof/Pj/wCRpP8A4qugooA5/wD4Vfof/Pj/AORpP/iqP+FX6H/z4/8AkaT/AOKroKKAOf8A+FX6H/z4/wDkaT/4qj/hV+h/8+P/AJGk/wDiq6CigDn/APhV+h/8+P8A5Gk/+Ko/4Vfof/Pj/wCRpP8A4qugooA5/wD4Vfof/Pj/AORpP/iqP+FX6H/z4/8AkaT/AOKroKKAOf8A+FX6H/z4/wDkaT/4qj/hV+h/8+P/AJGk/wDiq6CigDn/APhV+h/8+P8A5Gk/+Ko/4Vfof/Pj/wCRpP8A4qugooA5/wD4Vfof/Pj/AORpP/iqP+FX6H/z4/8AkaT/AOKroKKAOf8A+FX6H/z4/wDkaT/4qj/hV+h/8+P/AJGk/wDiq6CigDn/APhV+h/8+P8A5Gk/+Ko/4Vfof/Pj/wCRpP8A4qugooA5/wD4Vfof/Pj/AORpP/iqP+FX6H/z4/8AkaT/AOKroKKAOf8A+FX6H/z4/wDkaT/4qj/hV+h/8+P/AJGk/wDiq6CigDn/APhV+h/8+P8A5Gk/+Ko/4Vfof/Pj/wCRpP8A4qugooA5/wD4Vfof/Pj/AORpP/iqP+FX6H/z4/8AkaT/AOKroKKAOf8A+FX6H/z4/wDkaT/4qj/hV+h/8+P/AJGk/wDiq6CigDn/APhV+h/8+P8A5Gk/+Ko/4Vfof/Pj/wCRpP8A4qugooA5/wD4Vfof/Pj/AORpP/iqP+FX6H/z4/8AkaT/AOKroKKAOf8A+FX6H/z4/wDkaT/4qj/hV+h/8+P/AJGk/wDiq6CigDn/APhV+h/8+P8A5Gk/+Ko/4Vfof/Pj/wCRpP8A4qugooA5/wD4Vfof/Pj/AORpP/iqP+FX6H/z4/8AkaT/AOKroKKAOf8A+FX6H/z4/wDkaT/4qj/hV+h/8+P/AJGk/wDiq6CigDn/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" style="width: 62.00px; height: 57.33px; margin-left: 0.00px; margin-top: 0.00px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title=""></span></p></body></html>
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
                        style={{width: wp('100%'), backgroundColor: 'yellow'}}
                    
                    />
                <View style={[pageStyles.pqCont, {backgroungColor: '#fff'}]}>
                    {/* <ScrollView style={pageStyles.vetScrol}>
                        <ScrollView horizontal={true} style={pageStyles.horiScrol}>
                            <Image style={pageStyles.questionImgStyle} source={sectionToDisplayImgs.questions[questNo].url}/>
                            <View style={pageStyles.padder}></View>
                        </ScrollView>
                    </ScrollView>
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
