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
        width: '90%',
        height: '8%',
        top: '19%',
        left: '5%',
        marginBottom: '10%',
        justifyContent: 'center',
        borderColor: colors.textColor,
        borderBottomWidth: 1,
    },

    cardHeaderText: {
        color: colors.appColor,
        fontSize: hp('2.5%'),
        textAlign: 'center',
    },

    cardArea: {
        width: '90%',
        height: '8%',
        borderRadius: 25,
        top: '20.1%',
        borderColor: colors.textColor,
        borderBottomWidth: 2,
        left: '5%',
        justifyContent: 'center',
        marginBottom: '7.3%',
        backgroundColor: colors.appColor,
    },

    cardText: {
        color: colors.textColor,
        fontSize: hp('2.3%'),
        textAlign: 'center',
        paddingLeft: hp('2%'),
    },
    
    info: {
        width: wp('100%'),
        color: colors.orange,
        fontSize: hp('2.3%'),
        top: '20.1%',
        height: '20%',
        fontWeight: 'bold',
        left: wp('0%'),
        padding: wp('5%'),
        textAlign: 'center',
        alignSelf: 'flex-end',
        marginBottom: '30%',
    },

    galarey: {
        width: wp('100%'),
        alignSelf: 'flex-end',
        marginTop: '10%',
        height: '20%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: colors.appColor,
        justifyContent: 'space-between',
    },

    paymentPlatforms: {
        position: 'relative',
    },

    bankPaymentForm: {
        backgroundColor: colors.appColor,
        height: hp('70%'),
        width: wp('100%'),
        top: hp('30%`'),
        position: 'absolute',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },

    closeButn: {
        top: 0,
    },

    formHeader: {
        color: colors.textColor,
        fontSize: hp('3%'),
        height: hp('10%'),
        top: '3%',
        position: 'absolute',
        alignSelf: 'center',
        textAlign: 'center',
    },

    formText: {
        top: '12%',
        left: '5%',
        paddingVertical: '3%',
        width: '90%',
        fontSize:  hp('2.3%'),
        color: colors.textColor,
        borderBottomWidth: 2,
        borderColor: colors.textColor,
    },
    
    message: {
        color: colors.textColor,
        fontSize: hp('2.5%'),
        textAlign: 'center',
        position: 'absolute',
        width: wp('90%'),
        left: wp('5%'),
        top: hp('77%')
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