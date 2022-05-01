import React, {useState, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Text, View, TouchableOpacity, SafeAreaView, Image, FlatList, Button} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import BlockedFeature from "../components/BlockedFeature.component"
import styles from '../styles/master.js';
import pageStyles from '../styles/rateProgStyles.js';
import { Platform } from 'react-native-web';

let render_course_analysis_card = true
let testRecords = []

const courses = [
    {
        name: 'maths',
        courseStrength: 0,
        totalTestDone: 0,
        averageScore: 0,
        average_time_spent_per_question: 0, //unit = seconds
        average_time_taken_to_complete_tests: 0, //unit = seconds
        tests: [],
    },
    {
        name: 'physics',
        courseStrength: 0,
        totalTestDone: 0,
        averageScore: 0,
        average_time_spent_per_question: 0,
        average_time_taken_to_complete_tests: 0,
        tests: [],
    },
    {
        name: 'chemistry',
        courseStrength: 0,
        totalTestDone: 0,
        averageScore: 0,
        average_time_spent_per_question: 0,
        average_time_taken_to_complete_tests: 0,
        tests: [],
    },
    {
        name: 'biology',
        courseStrength: 0,
        totalTestDone: 0,
        averageScore: 0,
        average_time_spent_per_question: 0,
        average_time_taken_to_complete_tests: 0,
        tests: [],
    },
]

export default function RateProg({navigation}) {
    function openMenu () {
        navigation.openDrawer();
    }

    const is_token_obtained = useRef(false)

    console.log(is_token_obtained);

    const [BLOCKED_FEATURE_CARD, setBLOCKED_FEATURE_CARD] = useState()
    const getToken = async () => {
        if (!is_token_obtained.current) { //this is to prevent this process from running more than once and slowing the application down
            try {
              let token = await AsyncStorage.getItem('vpa')
              if (token !== 'true') {
                  is_token_obtained.current = true
                  DISPLAY_BLOCKED_FEATURE_CARD()
                  return false
                } else {
                    setBLOCKED_FEATURE_CARD()
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    function DISPLAY_BLOCKED_FEATURE_CARD() {
        setBLOCKED_FEATURE_CARD(
            <BlockedFeature navFunc={() => navigation.navigate('Register')}/>
        )
    }
    
    const [courseAnalysisCard, setcourseAnalysisCard] = useState()
    const getAllTestData = async () => {
        testRecords = []
        courses.forEach(course => { //resets course array
            course.courseStrength = 0
            course.totalTestDone = 0
            course.averageScore = 0
            course.average_time_spent_per_question = 0
            course.average_time_taken_to_complete_tests = 0
            course.tests = []
        });
        let response
        let testObj
        try {
            let testKeys = await AsyncStorage.getAllKeys()
            testKeys.pop()
            testKeys.pop()
            testKeys.pop() // remove non test keys like the users vpa or email address
            response = await AsyncStorage.multiGet(testKeys)
            console.log(testKeys);
            response.forEach(test => {
                testObj = JSON.parse(test[1])
                testObj.key = test[0]
                testRecords.push(testObj)
            });
            //gathers and sends the test for each course to their respective arrays
            testRecords.forEach(test => {
                courses.forEach((course, index) => {
                    if (test.course === course.name) {
                        course.tests.push(test)
                        course.totalTestDone = course.tests.length
                        getAveScore(index)
                        getAveTime(index)
                    }
                })
            })
        } catch (error) {
            console.log(error);
        }
        renderCourseAnalysis()
    }

    const getAveScore = (index) => {
        let totalScore = 0
        courses[index].tests.forEach(test => {
            totalScore += test.score
        });
        courses[index].courseStrength = (totalScore).toFixed(3)
        courses[index].averageScore = (totalScore/courses[index].totalTestDone).toFixed(2)
    }

    const getAveTime = (index) => {
        let totalTime = 0
        courses[index].tests.forEach(test => {
            totalTime+= test.timeTaken
        });
        if (!isNaN((totalTime/courses[index].totalTestDone)) && (totalTime/courses[index].totalTestDone) != Infinity) {
            courses[index].average_time_taken_to_complete_tests = totalTime/courses[index].totalTestDone
        } else {
            courses[index].average_time_taken_to_complete_tests = 0
        }
        get_average_time_spent_per_question(index, totalTime)
    }
    
    const get_average_time_spent_per_question = (index, totalTime) => {
        let totalNoOfQuestionsAttempted = 0
        courses[index].tests.forEach(test => {
            totalNoOfQuestionsAttempted+= test.noOfQuestionsAttempted
        });
        if (!isNaN((totalTime/totalNoOfQuestionsAttempted)) && (totalTime/totalNoOfQuestionsAttempted) != Infinity) {
            courses[index].average_time_spent_per_question = (totalTime/totalNoOfQuestionsAttempted)
        } else {
            courses[index].average_time_spent_per_question = 0
        }
    }

    const renderCourseAnalysis = () => {
        setcourseAnalysisCard(
            <SafeAreaView style={{flex: 1, top: hp('17%')}}>
                <FlatList
                    data = {courses}
                    contentContainerStyle = {{paddingBottom: 200}}
                    renderItem={({item}) => (
                        <View>
                            <Text style={pageStyles.courseName}>{item.name.toUpperCase()}:</Text>
                            <View style={pageStyles.courseCont}>
                                <Text style={pageStyles.testDataTextStyle}>Total Test Taken: {item.totalTestDone}</Text>
                                <Text style={pageStyles.testDataTextStyle}>Average Score: {item.averageScore}</Text>
                                <Text style={pageStyles.testDataTextStyle}>Course Strength: {item.courseStrength}</Text>
                                <Text style={pageStyles.testDataTextStyle}>Average Time Taken: {`${(item.average_time_taken_to_complete_tests/60).toFixed(2)}mins`}</Text> 
                                <Text style={pageStyles.testDataTextStyle}>Average Time Spent : {`${(item.average_time_spent_per_question/60).toFixed(2)}mins`}</Text> 
                                <TouchableOpacity style={pageStyles.restButn} onPress={()=> {resetData(item)}}>
                                    <Text style={pageStyles.restButnText}>Reset</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    keyExtractor = {(item) => item.name}
                />
            </SafeAreaView>
        )
    }
    
    
    
    const resetData = async (course) => {
        let testKeys = []
        course.tests.forEach(test => {
            testKeys.push(test.key)
        });
        try {
            await AsyncStorage.multiRemove(testKeys)
            render_course_analysis_card = false
            getAllTestData()
        } catch (error) {
            console.log(error);
        }
    }

    const renderHandler = () => {
        getToken()
        if (render_course_analysis_card) {
            getAllTestData()
            render_course_analysis_card = false
        }
    }
    
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCont}>
                <Text style={styles.baseText}>RATE PROGRESS</Text>
                <TouchableOpacity style={styles.menuIcon} onPress={openMenu} opacity={1}>
                    {Platform.OS!== 'web'?<Image source={require('../icons/menuIcon.png')}/>: <img width={100} src={require('../icons/menuIcon.png')}/>}
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress = {getAllTestData} style={pageStyles.refreshButn}>
                <Text style={pageStyles.refreshButnText}>Refresh</Text>
            </TouchableOpacity>
            {renderHandler()}
            {BLOCKED_FEATURE_CARD}
            {courseAnalysisCard}
            <StatusBar style="light" />
        </SafeAreaView>

    )
    
}