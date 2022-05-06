import React from 'react';
import {
    Text,
    View,
    Image,
    Platform,
    TouchableHighlight
} from 'react-native';
import styles from '../styles/master.js';
import colors from '../styles/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function BlockedFeature({navFunc}) {
    return (
        <View style={styles.BLOCKED_FEATURE_CARD}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                {Platform.OS !== 'web'?<Image resizeMode={'center'} style={{marginHorizontal: '25%', width: '50%'}} source={require('../icons/blocked.png')}/>:<img style={{marginHorizontal: '25%', width: '50%'}} src={require('../icons/blocked.png')}/>}
            </View>
            <Text style={styles.BLOCKED_FEATURE_CARD_TEXT}>
                <Text style={{fontSize: hp('5%'), fontWeight: 'bold'}}>Oops!</Text>
                {'\n'}
                {'\n'}
                This Feature Is Only Available For Paid Users!
            </Text>
            <TouchableHighlight underlayColor={colors.underlayColor} style={{ backgroundColor: colors.underlayColor, width: '50%', paddingVertical: '3%', left: '25%', top: '3%'}} onPress={navFunc}>
                <Text style={{ fontSize: hp('3%'), color: colors.textColor, textAlign: 'center' }}>Make Payment.</Text>
            </TouchableHighlight>
        </View>
    )
}