import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Platform } from "react-native-web";
import colors from './colors.js'

export default StyleSheet.create({
    refreshButn: {
        width: wp('100%'),
        height: hp('7%'),
        top: hp('15%'),
        backgroundColor: colors.appColor,
        justifyContent: 'center',
        alignItems: 'center'
    },

    refreshButnText: {
        color: colors.textColor,
        fontSize: hp('2.2%')
    },

    courseCont: {
        width: wp('90%'),
        left: wp('5%'),
        borderWidth: 2,
        borderColor: colors.appColor,
        height: hp('37%'),
        position: 'relative',
        top: hp('0%'),
        marginBottom: hp('5%'),
        backgroundColor: colors.appColor,
    },

    courseName: {
        fontSize: hp('3%'),
        color: colors.appColor,
        left: wp('5%'),
        paddingHorizontal: Platform.OS !== 'web'? 0: wp('5%')
    },

    testDataTextStyle: {
        fontSize: hp('2.8%'),
        color: colors.textColor,
        left: wp('7%'),
        top: hp('2.5%'),
        marginBottom: hp('1.7%')
    },

    restButn: {
        width: wp('27%'),
        left: wp('55%'),
        borderWidth: 2,
        borderColor: colors.textColor,
        height: Platform.OS !== 'web'? hp('2.4%'):'fit-content',
        position: 'absolute',
        top: hp('30%'),
        marginBottom: '10%',
        backgroundColor: colors.appColor,
    },

    restButnText: {
        color: colors.textColor,
        fontSize: hp('2.5%'),
        textAlign: 'center',
        paddingVertical: 7
    }
})