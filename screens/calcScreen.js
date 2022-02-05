import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Text, View, TouchableOpacity, SafeAreaView, TextInput, Image} from 'react-native';

import styles from '../styles/master.js';
import pageStyles from '../styles/calcScreenStyle.js';

export default function calcScreen({navigation}) {
    function openMenu () {
        navigation.openDrawer();
    }

    const [sub1ScoreState, setsub1ScoreState] = useState('')
    const [sub2ScoreState, setsub2ScoreState] = useState('')
    const [sub3ScoreState, setsub3ScoreState] = useState('')

    const [sub1PntsState, setsub1PntsState] = useState('')
    const [sub2PntsState, setsub2PntsState] = useState('')
    const [sub3PntsState, setsub3PntsState] = useState('')

    const [sub1GradeState, setsub1GradeState] = useState('A')
    const [sub2GradeState, setsub2GradeState] = useState('A')
    const [sub3GradeState, setsub3GradeState] = useState('A')
    const [totalPntState, settotalPntState] = useState('Total Points: ')
    const updateStates = (val, state)=> {
        state(val)
        if (state === setsub1ScoreState || state === setsub2ScoreState || state === setsub3ScoreState) {
            const score = parseInt(val)
            if (!isNaN(score) && score <=100) {
                if (state === setsub1ScoreState) {
                    if (score >= 70 && score <=100) {
                        setsub1PntsState('5')
                        setsub1GradeState('A')
                    } else if (score >= 60 && score <=69) {
                        setsub1PntsState('4')
                        setsub1GradeState('B')
                    } else if (score >= 50 && score <=59) {
                        setsub1PntsState('3')
                        setsub1GradeState('C')
                    } else if (score >= 40 && score <=49) {
                        setsub1PntsState('2')
                        setsub1GradeState('D')
                    } else if (score >= 30 && score <=39) {
                        setsub1PntsState('1')
                        setsub1GradeState('E')
                    } else if (score >= 0 && score <=29) {
                        setsub1PntsState('0')
                        setsub1GradeState('F')
                    } else{
                    }
                } else if (state === setsub2ScoreState) {
                    if (score >= 70 && score <=100) {
                        setsub2PntsState('5')
                        setsub2GradeState('A')
                    } else if (score >= 60 && score <=69) {
                        setsub2PntsState('4')
                        setsub2GradeState('B')
                    } else if (score >= 50 && score <=59) {
                        setsub2PntsState('3')
                        setsub2GradeState('C')
                    } else if (score >= 40 && score <=49) {
                        setsub2PntsState('2')
                        setsub2GradeState('D')
                    } else if (score >= 30 && score <=39) {
                        setsub2PntsState('1')
                        setsub2GradeState('E')
                    } else if (score >= 0 && score <=29) {
                        setsub2PntsState('0')
                        setsub2GradeState('F')
                    } else{
                    }
                } else if (state === setsub3ScoreState) {
                    if (score >= 70 && score <=100) {
                        setsub3PntsState('5')
                        setsub3GradeState('A')
                    } else if (score >= 60 && score <=69) {
                        setsub3PntsState('4')
                        setsub3GradeState('B')
                    } else if (score >= 50 && score <=59) {
                        setsub3PntsState('3')
                        setsub3GradeState('C')
                    } else if (score >= 40 && score <=49) {
                        setsub3PntsState('2')
                        setsub3GradeState('D')
                    } else if (score >= 30 && score <=39) {
                        setsub3PntsState('1')
                        setsub3GradeState('E')
                    } else if (score >= 0 && score <=29) {
                        setsub3PntsState('0')
                        setsub3GradeState('F')
                    } else{
                    }
                }
            } else{
                state('')
            }
        } else if (state === setsub1PntsState || state === setsub2PntsState || state === setsub3PntsState) {
            const Pnts = parseInt(val)
            if (!isNaN(Pnts) && Pnts<=5) {
                if (state === setsub1PntsState) {
                    if (Pnts === 5) {
                        setsub1ScoreState('')
                        setsub1GradeState('A')
                    } else if (Pnts === 4) {
                        setsub1ScoreState('')
                        setsub1GradeState('B')
                    } else if (Pnts === 3) {
                        setsub1ScoreState('')
                        setsub1GradeState('C')
                    } else if (Pnts === 2) {
                        setsub1ScoreState('')
                        setsub1GradeState('D')
                    } else if (Pnts === 1) {
                        setsub1ScoreState('')
                        setsub1GradeState('E')
                    } else if (Pnts === 0) {
                        setsub1ScoreState('')
                        setsub1GradeState('F')
                    } else{
                    }
                } else if (state === setsub2PntsState) {
                    if (Pnts === 5) {
                        setsub2ScoreState('')
                        setsub2GradeState('A')
                    } else if (Pnts === 4) {
                        setsub2ScoreState('')
                        setsub2GradeState('B')
                    } else if (Pnts === 3) {
                        setsub2ScoreState('')
                        setsub2GradeState('C')
                    } else if (Pnts === 2) {
                        setsub2ScoreState('')
                        setsub2GradeState('D')
                    } else if (Pnts === 1) {
                        setsub2ScoreState('')
                        setsub2GradeState('E')
                    } else if (Pnts === 0) {
                        setsub2ScoreState('')
                        setsub2GradeState('F')
                    } else{
                    }
                } else if (state === setsub3PntsState) {
                    if (Pnts === 5) {
                        setsub3ScoreState('')
                        setsub3GradeState('A')
                    } else if (Pnts === 4) {
                        setsub3ScoreState('')
                        setsub3GradeState('B')
                    } else if (Pnts === 3) {
                        setsub3ScoreState('')
                        setsub3GradeState('C')
                    } else if (Pnts === 2) {
                        setsub3ScoreState('')
                        setsub3GradeState('D')
                    } else if (Pnts === 1) {
                        setsub3ScoreState('')
                        setsub3GradeState('E')
                    } else if (Pnts === 0) {
                        setsub3ScoreState('')
                        setsub3GradeState('F')
                    } else{
                    }
                }
            } else{
                state('')

            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCont}>
                <Text style={styles.baseText}>POINT CALCULATOR</Text>
                <TouchableOpacity style={styles.menuIcon} onPress={openMenu}>
                    <Image source={require('../icons/menuIcon.png')}/>
                </TouchableOpacity>
            </View>
            <View style={pageStyles.guideCont}>
                <Text style={pageStyles.subject}>Subject</Text>
                <Text style={pageStyles.score}>Score</Text>
                <Text style={pageStyles.points}>Points</Text>
                <Text style={pageStyles.grade}>Grade</Text>
            </View>
            <View style={pageStyles.subjectCont}>
                <TextInput placeholder='Subject 1:' maxLength = {14} style={pageStyles.subject}></TextInput>
                <TextInput keyboardType='number-pad' placeholder=' eg. 100' value={sub1ScoreState} onChangeText={(val) => {updateStates(val, setsub1ScoreState)}} maxLength = {3} style={pageStyles.score}></TextInput>
                <TextInput maxLength={1} keyboardType='number-pad' placeholder='eg. 5' value={sub1PntsState} onChangeText={(val) => {updateStates(val, setsub1PntsState)}} style={pageStyles.points}></TextInput>
                <Text style={pageStyles.grade}>{sub1GradeState}</Text>
            </View>
            <View style={pageStyles.subjectCont}>
                <TextInput placeholder='Subject 2:' maxLength = {14} style={pageStyles.subject}></TextInput>
                <TextInput keyboardType='number-pad' placeholder='eg. 100' value={sub2ScoreState} onChangeText={(val) => {updateStates(val, setsub2ScoreState)}} maxLength = {3} style={pageStyles.score}></TextInput>
                <TextInput maxLength={1} keyboardType='number-pad' placeholder='eg. 5' value={sub2PntsState} onChangeText={(val) => {updateStates(val, setsub2PntsState)}} style={pageStyles.points}></TextInput>
                <Text style={pageStyles.grade}>{sub2GradeState}</Text>
            </View>
            <View style={pageStyles.subjectCont}>
                <TextInput placeholder='Subject 3:' maxLength = {14} style={pageStyles.subject}></TextInput>
                <TextInput keyboardType='number-pad' placeholder='eg. 100' value={sub3ScoreState} onChangeText={(val) => {updateStates(val, setsub3ScoreState)}} maxLength = {3} style={pageStyles.score}></TextInput>
                <TextInput maxLength={1} keyboardType='number-pad' placeholder='eg. 5' value={sub3PntsState} onChangeText={(val) => {updateStates(val, setsub3PntsState)}} style={pageStyles.points}></TextInput>
                <Text style={pageStyles.grade}>{sub3GradeState}</Text>
            </View>
            <TouchableOpacity style={pageStyles.calcButn} onPress={() => {
                const pntArray = [parseInt(sub1PntsState), parseInt(sub2PntsState), parseInt(sub3PntsState)]
                let totalScore = 0
                pntArray.forEach(pnt => {
                    if (!isNaN(pnt)) {
                        totalScore += pnt
                    }
                });
                settotalPntState(`Total Points: ${totalScore}`)

            }}>
                <Text style={pageStyles.calcText}>Calculate</Text>
            </TouchableOpacity>
            <Text style={pageStyles.totalPoints}>{totalPntState}</Text>
            <View style={pageStyles.scoreGuiderCont}>
                <Text style={pageStyles.scoreDetails}>Score</Text>
                <Text style={pageStyles.pointsDetails}>Points</Text>
                <Text style={pageStyles.scoreDetails}>A = 70 - 100</Text>
                <Text style={pageStyles.pointsDetails}>5</Text>
                <Text style={pageStyles.scoreDetails}>B = 60 - 69</Text>
                <Text style={pageStyles.pointsDetails}>4</Text>
                <Text style={pageStyles.scoreDetails}>C = 50 - 59</Text>
                <Text style={pageStyles.pointsDetails}>3</Text>
                <Text style={pageStyles.scoreDetails}>D = 40 - 49</Text>
                <Text style={pageStyles.pointsDetails}>2</Text>
                <Text style={pageStyles.scoreDetails}>E = 30 - 39</Text>
                <Text style={pageStyles.pointsDetails}>1</Text>
                <Text style={pageStyles.scoreDetails}>F = 0 - 29</Text>
                <Text style={pageStyles.pointsDetails}>0</Text>
            </View>
            <StatusBar style="light" />
        </SafeAreaView>
        

    )
    
}