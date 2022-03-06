import { StyleSheet, Dimensions } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from './colors.js'
const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width
console.log(deviceHeight);
navigationContTop = hp('70%')
let closePqCardTop = hp('0%')
let questOptionsContainerTop = hp('65%')
let qualityContButnTop = '40%'

if (deviceHeight<= 600) {
    navigationContTop = hp('65%')
    closePqCardTop = hp('-1.2%')
    qualityContButnTop = '27%'
    questOptionsContainerTop = hp('55%')
} else if (deviceHeight >= 800) {
    navigationContTop = hp('67%')
    closePqCardTop = hp('1%')
    qualityContButnTop = '50%'
    questOptionsContainerTop = hp('60%')
}
export default StyleSheet.create({
    qualityContButn: {
        width: wp('10%'),
        alignSelf: 'flex-end',
        marginRight: wp('8%'),
        top: qualityContButnTop,
    },

    qualityContButnImg: {
        width: hp('4%')
    },

    list: {
        position: 'absolute',
        width: wp('95%'),
        height: hp('100%'),
        backgroundColor: colors.bodyBackground,
        left: wp('2.5%'),
        top: hp('25%'),
    },
    
    items: {
        borderWidth: 2,
        borderColor: colors.appColor,
        width: '70%',
        height: '7.5%',
        marginBottom: 25/5 +'%',
        top: hp('4%'),
        left: wp('15%'),
    },
    
    itemName: {
        color: colors.grey,
        alignContent: 'center',
        fontSize: hp('2.4%'),
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3.3%',
    },
    
    cancelButn: {
        backgroundColor: colors.appColor,
        width: wp('27%'),
        height: hp('6%'),
        position: 'absolute',
        top: hp('60%'),
        alignSelf: 'center'
    },
    
    listButnText: {
        width: '100%',
        height: '100%',
        flex: 1,
        color: colors.textColor,
        fontSize: hp('3%'),
        textAlign: "center",
        padding: '5%'
    },

    pqCard: {
        position: 'absolute',
        top: hp('15%'),
        backgroundColor: colors.appColor,
        height: hp('100%'),
        width: wp('100%')
    },

    pqHeader: {
        width: wp("100%"),
        height: hp('7.3%'),
        backgroundColor: colors.appColor,
        position: 'relative',
    },

    pqHeaderText: {
        fontSize: hp('2%'),
        width: wp('100%'),
        color: colors.textColor,
        textAlign: 'center',
        alignSelf: 'center',
        // left: wp('10%'),
        padding: hp('2%')
    },

    closePqCard: {
        position: 'absolute',
        left: wp('1%'),
        top: closePqCardTop,
        width: wp('10%'),
        height: hp('82%'),
    },

    pqCont: {
        flex: 1,
        position: 'relative',
        alignItems: 'center',
        width: wp("100%"),
        justifyContent: 'center',
        left: wp('0%'),
        height: hp('100%'),
        // top: '3.5%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    vetScrol: {
        flex: 1,
        width: wp("100%"),
        height: 180,
        top: hp('0%'),
        left: wp('0%'),
        marginBottom: '10%',
    },

    questionImgStyle: {
        // position: 'relative',
        top: '0%',
        left: '0%',
        marginBottom: '20%',
    },

    padder: {
        height: hp('20%'),
        width: wp('100%'),
        position: 'relative',
    },

    navigationCont: {
        position: 'absolute',
        width: wp('100%'),
        height: hp('13%'),
        top: navigationContTop,
        alignSelf: 'center',
        backgroundColor: colors.appColor,
    },

    previousButn: {
        position: 'absolute',
        top: '12.5%',
        left: '10%',
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },

    nextButn: {
        position: 'absolute',
        top: '11.5%',
        left: '80%',
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },

    ansButn: {
        borderTopLeftRadius: 25,
        left: '70%',
        padding: 6,
        backgroundColor: colors.appColor,
        width: '30%',
    },

    ansButnText: {
        color: colors.bodyBackground,
        fontSize: hp('2.5%'),
        textAlign: 'center'
    },

    timeBox: {
        position: 'relative',
        display: 'flex',
        borderColor: colors.appColor,
        borderWidth: 1,
        width: '50%',
        height: hp('6%'),
        alignSelf: 'flex-end'
    },

    timeDisplayed: {
        color: '#fff',
        position: 'absolute',
        fontSize: hp('2%'),
        width: '45%',
        height: 57,
        alignSelf: 'flex-end',
        top: 0,
        paddingTop: 15,
        textAlign: 'center',
    },

    time: {
        position: 'relative',
        fontSize: hp('2.3%'),
        paddingTop: '4%',
        color: colors.grey,
        marginBottom: -100,
        textAlign: 'center',
    },

    enableTimerButn: {
        position: 'absolute',
        height: 50,
        top: 0,
        width: '45%',
        padding: '5%',
        height: hp('6%'),
        borderColor: colors.appColor,
        borderWidth: 1,
        backgroundColor: colors.appColor,
    },
    
    enableTimerText: {
        color: colors.textColor,
        fontSize: hp('2.3%'),
        textAlign: 'center'
    },

    listOptionsCont: {
        position: 'absolute',
        width: wp('75%'),
        height: hp('50%'),
        top: hp('30%'),
        left: wp('12.5%'),
    
    },
    
    listOptions: {
        borderColor: colors.appColor,
        borderWidth: 2,
        width: '100%',
        height: '17%',
        textAlign: 'center',
        marginBottom: 25/4 +'%',
    },
    
    listOptionsText: {
        color: colors.grey,
        fontSize: hp('2.3%'),
        padding: hp('2%'),
    },
    
    questOptionsContainer: {
        position: 'absolute',
        width: wp('130%'),
        height: hp('14%'),
        top: questOptionsContainerTop,
        left: '0%',
        backgroundColor: colors.appColor,
    },

    questOptionsButn: {
        position: 'absolute',
        width: 50,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    questOptionsText: {
        padding: -20,
        color: colors.textColor,
        fontSize: 25,
        textAlign: 'center',
    },

    startButn: {
        backgroundColor: colors.appColor,
        width: wp('30%'),
        height: hp('6%'),
        position: 'absolute',
        left: wp('57.5%'),
        top: hp('75%'),
        zIndex: -1,
    },

    startText: {
        color: colors.textColor,
        fontSize: hp('3%'),
        textAlign: "center",
        padding: hp('1.2%')
    },

    questionStatusBar: {
        position: 'relative',
        top: '25%',
        width: wp('90%'),
        height: hp('8%'),
        left: wp('5%'),
        backgroundColor: colors.appColor,
        marginBottom: 0,
        borderBottomWidth: 2,
        borderBottomColor: colors.textColor,
    },

    answerNo: {
        color: colors.textColor,
        fontSize: hp('2%'),
        width: '15%',
        height: 60,
        left: '1%',
        textAlign: 'center',
        top: 0,
        position: 'relative',
        paddingTop: 20,
    },

    correctAnswer: {
        color: colors.textColor,
        fontSize: hp('2%'),
        width: '40%',
        height: 60,
        left: '15%',
        textAlign: 'center',
        top: -58,
        position: 'relative',
        paddingTop: 20
    },

    userAns: {
        color: colors.textColor,
        fontSize: hp('2%'),
        width: '65%',
        height: 60,
        left: '40%',
        textAlign: 'center',
        top: -120,
        position: 'relative',
        paddingTop: 20
    },
    
})