import React from 'react';
import pageStyles from '../styles/newsFeedStyles.js';
import MathJax from 'react-native-mathjax';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
    Text,
    View,
    Image,
    FlatList
} from 'react-native';

const data = []

function GenInfoComponent({data}) {
    if (!data.length) { //if there are no new info in this section //if there are no new info in this section
        return (
            <View style={pageStyles.card}>
                <Text style={pageStyles.header}>GENERAL INFORMATION</Text>
                <Image style={pageStyles.contentIcons} resizeMode={'center'} source={require('../icons/empty.png')}/>
                <Text style={pageStyles.nullText}>
                    Nothing to see here yet.
                </Text>
                <Text style={pageStyles.nullText}>
                    Try Refreshing To See Updates!
                </Text>
            </View>
        )
    } else {
        return (
            <View style={pageStyles.card}>
                <Text style={pageStyles.header}>GENERAL INFORMATION</Text>
                <View style={{flex: 1}}>
                    <FlatList
                        data={data}
                        contentContainerStyle = {{width: '100%', alignContent: 'space-around', paddingBottom: data.length*100}}
                        renderItem={({item}) => (
                            <View style={{
                                borderColor: '#9c27b0',
                                borderBottomWidth: 2,
                                width: '90%',
                                marginVertical: hp('3%'),
                                left: '5%',
                                justifyContent: 'center'
                            }}>
                                <Text style={pageStyles.topic}>{item.Topic}:</Text>
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
                                                    ${item&&item.Body?item.Body.replace('max-width: 180px;', 'max-width: 90vw;'):''}
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
                            </View>
                        )}
                        keyExtractor = {(item, index) => index.toString()}
                    />
                </View>
            </View>
        )

    }
}

export default GenInfoComponent;