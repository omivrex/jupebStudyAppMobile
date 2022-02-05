import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from './colors.js'

export default StyleSheet.create({
    guideCont: {
        position: 'absolute',
        width: wp('90%'),
        height: hp('7%'),
        justifyContent: 'center',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: colors.appColor,
        top: hp('17%'),
        left: wp('5%'),
    },
    
    guideText: {
        fontSize: hp('2%'),
        textAlign: 'left'
    },

    subjectCont: {
        width: wp('90%'),
        height: hp('7%'),
        top: hp('25%'),
        left: wp('5%'),
        marginBottom: hp('4%'),
        justifyContent: 'center',
        position: 'relative',
        borderStyle: 'solid',
        borderBottomWidth: 2,
        borderBottomColor: colors.appColor,

    },

    subject: {
        fontSize: hp('2.4%'),
        position: 'absolute',
    },
    
    score: {
        width: '30%',
        position: 'absolute',
        left: '30%',
        fontSize: hp('2.3'),
        textAlign: 'center',
    },

    points: {
        width: '30%',
        position: 'absolute',
        left: '50%',
        fontSize: hp('2.3%'),
        textAlign: 'center',
    },

    grade: {
        width: '20%',
        position: 'absolute',
        left: '80%',
        fontSize: hp('2.3%'),
        textAlign: 'center',
    },

    calcButn: {
        position: 'absolute',
        top: hp('55%'),
        left: wp('7%'),
        backgroundColor: colors.appColor,
        justifyContent: 'center',
        alignItems: 'center',
    },

    calcText: {
        color: colors.textColor,
        textAlign: 'center',
        padding: '3.5%',
        fontSize: hp('2.2%'),
    },

    totalPoints: {
        position: 'absolute',
        top: hp('55%'),
        left: wp('50%'),
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.appColor,
        textAlign: 'center',
        padding: '2.5%',
        fontSize: hp('2.3%'),
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: colors.appColor,
    },

    scoreGuiderCont: {
        position: 'absolute',
        height: hp('35%'),
        width: wp('100%'),
        top: hp('70%'),
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: colors.appColor,
    },

    scoreGuiderHeader: {
        fontSize: 30,
    },

    scoreDetails: {
        width: '40%',
        position: 'relative',
        left: '10%',
        fontSize: hp('2.3%'),
        top: '2%',
        marginBottom: '-2%',
        textAlign: 'left',
    },

    pointsDetails: {
        width: '40%',
        position: 'relative',
        left: '50%',
        fontSize: hp('2.3%'),
        top: '-3%',
        marginBottom: '-3.5%',
        textAlign: 'left',
    }

})