import { StyleSheet, Dimensions } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import colors from './colors.js'


const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

let paymentPlatformsWidth = 40
let paymentPlatformsLeft = wp('9%')
let closeButnTop = hp('0%')

if (deviceHeight<=600) {
    paymentPlatformsWidth = 30
    paymentPlatformsLeft = wp('9%')
    closeButnTop = hp('-2.5%')
} else if (deviceHeight>= 1000) {
    paymentPlatformsWidth = 90
    paymentPlatformsLeft = wp('2%')
}

export default StyleSheet.create({
    cardAreaHeader: {
        width: wp('90%'),
        height: hp('8%'),
        top: hp('19%'),
        position: 'absolute',
        left: wp('5%'),
        borderColor: colors.textColor,
        borderBottomWidth: 0.7,
        backgroundColor: colors.appColor,
    },

    cardHeaderText: {
        color: colors.textColor,
        fontSize: hp('2.3%'),
        textAlign: 'center',
        paddingTop: '3%',
    },

    cardArea: {
        width: wp('90%'),
        height: hp('6%'),
        top: hp('33.1%'),
        position: 'relative',
        borderColor: colors.textColor,
        borderBottomWidth: 2,
        left: wp('5%'),
        marginBottom: hp('7.3%'),
        backgroundColor: colors.appColor,
    },

    cardText: {
        color: colors.textColor,
        fontSize: hp('2.3%'),
        textAlign: 'left',
        paddingTop: '5%',
        paddingLeft: hp('2%')
    },

    info: {
        position: 'absolute',
        width: wp('100%'),
        color: colors.orange,
        backgroundColor: colors.appColor,
        fontSize: hp('2.3%'),
        top: hp('66.1%'),
        left: wp('0%'),
        padding: wp('5%'),
        textAlign: 'center'
    },

    galarey: {
        position: 'absolute',
        width: wp('100%'),
        height: hp('30%'),
        top: hp('80%'),
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'center',
        borderColor: colors.textColor,
        borderTopWidth: 0.7,
    },

    paymentPlatforms: {
        position: 'relative',
        // marginRight: wp('1%'),
        marginTop: hp('2%'),
        alignSelf: 'baseline',
        width: paymentPlatformsWidth,
        left: paymentPlatformsLeft,
    },

    bankPaymentForm: {
        backgroundColor: colors.appColor,
        height: hp('60%'),
        width: wp('100%'),
        top: hp('20%`'),
        position: 'absolute'
    },

    closeButn: {
        position: 'absolute',
        left: 6,
        top: closeButnTop,
        width: wp('10%'),
        height: hp('10%'),
    },

    formHeader: {
        color: colors.textColor,
        fontSize: hp('3%'),
        width: wp('100%'),
        height: hp('10%'),
        top: 0  ,
        alignSelf: 'center',
        textAlign: 'center',
        position: 'absolute'
    },

    formText: {
        top: '12%',
        left: '5%',
        height: '9%',
        width: '90%',
        paddingTop: 0,
        fontSize:  hp('2.3%'),
        color: colors.textColor,
        borderBottomWidth: 2,
        borderColor: colors.textColor,
    },
    
    message: {
        color: colors.orange,
        fontSize: hp('2.5%'),
        textAlign: 'center',
        position: 'absolute',
        width: wp('100%'),
        top: hp('67%')
    },

    nextButn: {
        backgroundColor: colors.orange,
        width: '30%',
        height: '7%',
        position: 'absolute',
        top: hp('54%'),
        left: wp('35%')
    },

    nextButnText: {
        color: colors.textColor,
        fontSize: hp('2.3%'),
        textAlign: 'center',
        paddingTop: 3
    },

    chartUpButn: {
        width: '80%',
        height: '20%',
        top: '17%',
        left: '10%',
        position: 'relative',
        borderColor: colors.textColor,
        borderBottomWidth: 2,
    },

    chartUpButnText: {
        color: colors.textColor,
        fontSize: hp('2.3%'),
        textAlign: 'center',
        paddingTop: '15%'

    }
})