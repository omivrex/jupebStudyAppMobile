import pageStyles from '../styles/pqScreenStyles.js';
import MathJax from 'react-native-mathjax';
import WebMathJaxComponent from './WebMathJax.component.js';
import React from 'react';
import {
    View,
    Platform
} from 'react-native';

export default function ({data}) {
    return (
        <View style={pageStyles.answerCardWrapper}>
            <View style={pageStyles.answerCard}>
                {Platform.OS !== 'web'? 
                
            
                    <MathJax
                        html={
                            `   <head>
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
                                    <div style="font-size: 1em;
                                        font-family: Roboto, sans-serif, san Francisco;
                                        width: 90%;
                                        overflow-x: show;
                                        margin: auto;
                                        min-height: 50rem;
                                    ">
                                        ${data&&data.answer?data.answer.replace('max-width: 180px;', 'max-width: 90vw;'):'<h2 style="color: red;">Network Error!</h2>'}
                                    </div>
                                    <div style="height: 50%"></div>
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
                        style={{width: '98%', flex:2, marginTop: '5%', left: '1%'}}
                    />
                    :
                    <WebMathJaxComponent data={data&&data.answer?data.answer.replace('max-width: 180px;', 'max-width: 90vw;'):'<h2 style="color: red;">Network Error!</h2>'}/>
                }
            </View>
        </View>
    )
}