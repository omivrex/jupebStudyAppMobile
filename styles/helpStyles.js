import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Platform } from "react-native-web";
import colors from './colors.js'

export default StyleSheet.create({
    card: {
        width: wp('100%'),
        height: hp('90%'),
        top: hp('15%'),
        position: 'absolute',
        flex: 1,
        backgroundColor:colors.bodyBackground,
    },

    header: {
        fontSize: hp('3.5%'),
        width: '100%',
        height: hp('10%'),
        color: colors.appColor,
        textAlign: 'center',
        top: hp('3%'),
        textDecorationLine: 'underline'
        
    },

    StaticInfo: {
        top: hp('0%'),
        width: '90%',
        fontSize: hp('3%'),
        width: '100%',
        color: colors.appColor,
        textAlign: 'left',
        left: Platform.OS !== 'web'? '5%': '0px',
        margin: Platform.OS !== 'web'? 0:'auto',
        position: 'relative',
        marginBottom: '5%',
        fontSize: hp('2.5%'),
        color: colors.grey,
        left: wp('5%')
    },
})