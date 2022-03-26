import pageStyles from '../styles/pqScreenStyles.js';
import MathJax from 'react-native-mathjax';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React, {useState} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

export default function StartPracticeQuestion({questionData, displayLoadingComponent}) {
    const [optionsState, setoptionsState] = useState(false)
    const [loading, setloading] = useState()

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
                        <body style="width: 100%;">
                            <style>
                                * {
                                    -webkit-user-select: none;
                                    -moz-user-select: none;
                                    -ms-user-select: none;
                                    user-select: none;
                                }
                            </style>
                            <div style="font-size: 1.3em; font-family: Roboto, sans-serif, san Francisco">
                                ${questionData.question.replace('max-width: 180px;', 'max-width: 90vw;').trim()}
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
            <View style={pageStyles.questOptionsContainer}>
                <TouchableOpacity onPress={function () {
                    questionData.userOption = 'A'
                    displayLoadingComponent(500)
                    setoptionsState(true)
                }} style={[pageStyles.questOptionsButn, questionData.userOption === 'A'?{backgroundColor: '#301934'}:{backgroundColor: '#9c27b0'}]}>
                    <Text style={pageStyles.questOptionsText}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={function () {
                    questionData.userOption = 'B'
                    displayLoadingComponent(500)
                    setoptionsState(true)
                }} style={[pageStyles.questOptionsButn, questionData.userOption === 'B'?{backgroundColor: '#301934'}:{backgroundColor: '#9c27b0'}]}>
                    <Text style={pageStyles.questOptionsText}>B</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={function () {
                    questionData.userOption = 'C'
                    displayLoadingComponent(500)
                    setoptionsState(true)
                }} style={[pageStyles.questOptionsButn, questionData.userOption === 'C'?{backgroundColor: '#301934'}:{backgroundColor: '#9c27b0'}]}>
                    <Text style={pageStyles.questOptionsText}>C</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={function () {
                    questionData.userOption = 'D'
                    displayLoadingComponent(500)
                    setoptionsState(true)
                    {optionsState}
                }} style={[pageStyles.questOptionsButn, questionData.userOption === 'D'?{backgroundColor: '#301934'}:{backgroundColor: '#9c27b0'}]}>
                    <Text style={pageStyles.questOptionsText}>D</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}