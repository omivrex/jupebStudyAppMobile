import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import colors from './colors.js'

export default StyleSheet.create({
    tableOfContents: {
        flex: 1,
        width: wp('100%'),
        height: hp('90%'),
        top: hp('20%'),
        position: 'absolute',
        zIndex: -1,
    },

    content: {
        width: wp('90%'),
        height: hp('30%'),
        backgroundColor: colors.appColor,
        position: 'relative',
        marginBottom: hp('4%'),
        alignSelf: 'center',
        top: hp('10%'),
        zIndex: -1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    contentIcons: {
        height: hp('35%'),
        alignSelf: 'center',
        marginVertical: 0
    },

    contentText: {
        color: colors.textColor,
        fontSize: hp('2.6%'),
        padding: '3%',
        textAlign: 'center',
        top: hp('-7%')
    },

    profileCard: {
        backgroundColor: colors.bodyBackground,
        height: hp('100%'),
        width: wp('100%'),
        top: hp('17%`'),
        position: 'absolute'
    },

    ProfileText: {
        top: '4%',
        left: '5%',
        height: '12%',
        width: '90%',
        paddingTop: 30,
        color: colors.grey,
        fontSize:  hp('3%'),
        borderBottomWidth: 2,
        borderColor: colors.textColor,
    },

    editButn: {
        top: hp('35%'),
        position: 'relative',
        textAlign: 'center',
        color: '#eee',
        height: hp('5%'),
        width: wp('50%'),
        left: wp('25%'),
        fontSize: hp('3%'),
        paddingTop: 2.5,
        backgroundColor: "#841584",
    },

    editButnText: {
        textAlign: 'center',
        color: '#eee',
        fontSize: hp('3%'),
    }

})