import pageStyles from '../styles/pqScreenStyles.js';
import MathJax from 'react-native-mathjax';
import React from 'react';
import {
    Text,
    View,
} from 'react-native';

export default function ({data}) {
    return (
        <View style={pageStyles.answerCardWrapper}>
            <View style={pageStyles.answerCard}>
                {/* {data&&data.correctAnswer? 
                    <>
                        <Text style={pageStyles.correctAnswerComponent}>Correct Answer: {data?data.correctAnswer:''}</Text>
                    </>
                    :
                    <></>
                } */}
                <MathJax
                    html={
                        `   
                            <body style="width: 100%; overflow-y: auto; overflow-x: show;">
                                <style>
                                    * {
                                        -webkit-user-select: none;
                                        -moz-user-select: none;
                                        -ms-user-select: none;
                                        user-select: none;
                                    }
                                </style>
                                <div style="font-size: 1.3em;
                                    font-family: Roboto, sans-serif, san Francisco;
                                    width: 90%;
                                    overflow-x: show;
                                    margin: auto;
                                    min-height: 50rem;
                                ">
                                    ${data&&data.answer?data.answer.replace('max-width: 180px;', 'max-width: 90vw;'):''}
                                </div>
                                <div style="height: 50%"></div>
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
                    style={{width: '98%', flex:2, marginTop: '5%', left: '1%'}}
                />
            </View>
        </View>
    )
}