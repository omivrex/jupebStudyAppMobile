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
        // position: 'absolute',
        marginVertical: '6%',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    
    listButnText: {
        width: '100%',
        color: colors.textColor,
        fontSize: hp('3%'),
        textAlign: "center",
    },

    pqCard: {
        top: hp('70%'),
        height: hp('30%'),
        width: wp('100%'),
    },

    pqHeader: {
        width: wp("100%"),
        height: hp('7.3%'),
        backgroundColor: colors.appColor,
        position: 'relative',
        marginBottom: 5,
    },

    pqHeaderText: {
        fontSize: hp('2%'),
        width: wp('90%'),
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

    answerCardWrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: hp('24%'),
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },

    answerCard: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: colors.bodyBackground,
    },
    
    answerCardObj: {
        top: '60%',
        borderTopLeftRadius: 55,
        borderTopRightRadius: 55,
    },

    correctAnswerComponent: {
        color: '#eee',
        fontSize: hp('3%'),
        backgroundColor: colors.appColor,
        width: '50%',
        flex: 0.1,
        textAlign: 'center',
        justifyContent: 'center',
        paddingTop: '2%',
    },

    fullSoln: {
        backgroundColor: colors.orange,
        width: '50%',
        borderRadius: 25,
        flex: 0.1,
        marginTop: '5%'
    },
    
    fullSolnText: {
        color: '#eee',
        width: '100%',
        textAlign: 'center',
        fontSize: hp('2.5%'),
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

    timerCont: {
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'space-around',
    },

    timeBox: {
        position: 'relative',
        borderColor: colors.appColor,
        borderWidth: 1,
        width: '35%',
        marginTop: '5%',
        height: hp('6%'),
        alignSelf: 'center'
    },

    timeDisplayed: {
        color: '#fff',
        fontSize: hp('2%'),
        justifyContent: 'center',
        textAlign: 'center',
    },

    time: {
        fontSize: hp('2.3%'),
        paddingTop: '4%',
        color: colors.grey,
        marginBottom: -100,
        textAlign: 'center',
    },

    enableTimerButn: {
        width: '35%',
        marginTop: '5%',
        alignSelf: 'center',
        // left: '10%',
        justifyContent: 'center',
        height: hp('6%'),
        backgroundColor: colors.appColor,
    },
    
    enableTimerText: {
        color: colors.textColor,
        fontSize: hp('2.3%'),
        textAlign: 'center'
    },

    submitButn: {
        position: 'absolute',
        backgroundColor: colors.appColor,
        width: '100%',
        height: '10%',
        top: '90%',
        alignSelf: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
    },

    submitButnText: {
        color: '#fff',
        justifyContent: 'center',
        width: '100%',
        alignContent: 'center',
        fontSize: hp('3.3%'),
        textAlign: 'center',
    },

    listOptionsCont: {
        width: wp('100%'),
        top: hp('17%'),
        height: hp('83%'),
        justifyContent: 'center',
    },

    labelHeading: {
        width: '100%',
        fontSize: hp('2.9%'),
        textAlign: 'center',
        backgroundColor: colors.appColor,
        color: '#eee'
    },
    
    listOptions: {
        width: '70%',
        left: '15%',
        marginBottom: '10%'
    },
    
    listOptionsText: {
        backgroundColor: colors.appColor,
        color: '#fff',
        textAlign: 'center',
        borderRadius: 25,
        fontSize: hp('2.3%'),
        padding: hp('2%'),
    },
    
    questOptionsContainer: {
        width: '100%',
        flexDirection: 'row',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'space-around',
        backgroundColor: colors.appColor,
    },

    questOptionsButn: {
        width: '17%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    questOptionsText: {
        color: colors.textColor,
        fontSize: 25,
        width: '100%',
        textAlign: 'center',
    },

    startButn: {
        backgroundColor: colors.appColor,
        width: '35%',
        marginTop: '5%',
        height: hp('6%'),
        alignSelf: 'center',
        justifyContent: 'center',
    },

    startText: {
        color: colors.textColor,
        fontSize: hp('3%'),
        textAlign: "center",
    },

    questionStatusBar: {
        // top: '25%',
        width: '100%',
        height: '35%',
        // left: wp'5%'),
        backgroundColor: colors.appColor,
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
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

    resultOptionText: {
        color: colors.textColor,
        fontSize: hp('2%'),
        // width: '40%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
})