import { StyleSheet, Dimensions } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import colors from './colors.js'

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

let logoImageTop = hp('5%')
let blockHeight = hp('35%')
let blockTextTop = '-6%'
let menuIconTop = hp('7%')

if (deviceHeight<=600) {
  logoImageTop= (0.01*deviceHeight)
  blockHeight = hp('45%')
  menuIconTop = hp('5%')
  blockTextTop = '-12%'
}

export default StyleSheet.create({
    container: {
      flex: 1,
      height: hp('100%'),
      backgroundColor: colors.bodyBackground,
    },
    
    headerCont: {
      alignItems: "center",
      backgroundColor: colors.appColor,
      width: wp('100%'),
      height: hp('17%'),
      position: 'absolute',
      top: hp('0%'),
      borderColor: colors.bodyBackground,
      borderTopWidth: 2,
      flexDirection: 'column'
    },

    logoImage: {
      height: hp('10%'),
      marginVertical: hp('5%'),
      position: 'absolute'
    },
  
    menuIcon: {
      // top: menuIconTop,
      marginVertical: hp('5%'),
      alignSelf: 'flex-start',
      position: 'absolute',
    },

    baseText: {
      color: colors.textColor,
      fontSize: hp('3%'),
      textAlign: 'center',
      position: 'absolute',
      top: '55%',
      justifyContent: 'center',
      alignItems: 'center',
    },

    menu: {
      alignItems: 'center',
      backgroundColor: colors.appColor,
      width: '100%',
      height: '100%',
      position: 'relative',
      zIndex: -1,
    },
    
    menuItemCont: {
      width: '100%',
      height: '7%',
      top: hp('18%'),
      // backgroundColor: 'blue',
      marginBottom: hp('2%'),
    },
    
    menuText: {
      color: colors.textColor,
      alignSelf: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingTop: 10,
      height: '100%',
      position: 'absolute',
    }, 

    icon: {
      top: '-100%',
      position: 'relative',
      height: 20
    },

    regButn: {
      width: '85%',
      position: "relative",
      top: '4%',
      padding: 15,
      textAlign: 'center',
      color: colors.textColor,
      fontSize: 30,
      marginBottom: '-17%'
    },
    
    body: {
      height: hp('83%'),
      width: '100%',
      // position: 'absolute',
      top: hp('17%'),
      // flex: 1,
      // zIndex: -3
    },

    blockWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      width: '100%',
      height: '100%',
    },
    
    block: {
      backgroundColor: colors.appColor,
      width: '40%',
      height: '40%',
      marginTop: '5%',
      borderRadius: 25,
    },

    blockText: {
      fontSize: hp('1.6%'),
      color: colors.textColor,
      width: '100%',
      marginTop: '10%',
      textAlign: 'center',
    },

    blockIcon: {
      height: '30%',
      width: '30%',
      marginTop: '25%',
      alignSelf: 'center',
    },

    scrollView: {
      height: '60%',
      width: '100%',
    },

    splashCard: {
      width: wp('100%'),
      height: hp('150%'),
      position: 'absolute',
      backgroundColor: colors.appColor
    },

    splashImg: {
      alignSelf: 'center',
      top: hp('20%'),
    },

    splashInfo: {
      color: colors.textColor,
      fontSize: hp('2.5%'),
      textAlign: 'center',
      width: wp('100%'),
      top: hp('18%'),
      height: hp('10%')
    },

    splashButns: {
      width: wp('100%'),
      height: '5%',
      top: hp('10%'),
      marginBottom: hp('0%'),
      position: 'relative',
      alignSelf: 'center',
    },
    
    splashButnText: {
      color: colors.textColor,
      fontSize: hp('3.3%'),
      padding: 10,
      textAlign: 'center',
    },
    
    signUpCardButnText: {
      fontSize: hp('2%'),
    },

    cards: {
      backgroundColor: colors.bodyBackground,
      width: wp('100%'),
      height: hp('100%'),
      top: hp('15%'),
      position: 'absolute'
    },

    cardHeader: {
      color: colors.appColor,
      fontSize: hp('4%'),
      left: wp('40%'),
      top: '3%',
      textDecorationLine: 'underline'
    },

    textInput: {
      width: wp('78%'),
      height: hp('7%'),
      left: wp('11%'),
      fontSize: hp('3%'),
      padding: 10,
      top: hp('10%'),
      borderColor: colors.appColor,
      borderWidth: 2,
      marginBottom: '5%'
    },

    cardButn: {
      backgroundColor: colors.appColor,
      width: wp('55%'),
      height: hp('7%'),
      left: wp('22.5%'),
      top: hp('18%')
    },

    cardButnText: {
      color: colors.textColor,
      textAlign: 'center',
      fontSize: hp('3%'),
      padding: 10
    },

    message: {
      color: colors.appColor,
      fontSize: hp('2.5%'),
      textAlign: 'center',
      top: hp('67.7%'),
      position: 'absolute',
      display: 'none',
      textAlign: 'center',
      width: wp('100%')
    },

    BLOCKED_FEATURE_CARD: {
      width: wp('100%'),
      height: hp('100%'),
      backgroundColor: colors.appColor,
      top: hp('17%'),
      position: 'absolute',
      zIndex: 2,
    },

    BLOCKED_FEATURE_CARD_TEXT: {
      color: colors.orange,
      fontSize: hp('3%'),
      textAlign: 'center',
      width: '90%',
      left: '5%',
      top: '27%'
    },

    BLOCKED_FEATURE_CARD_REFRESH_BUTN: {
      top: hp('35%'),
      backgroundColor: "#841584",
      position: 'relative',
      textAlign: 'center',
      color: '#eee',
      height: hp('5%'),
      width: wp('50%'),
      left: wp('25%'),
      fontSize: hp('3%'),
      paddingTop: 2.5
    },

    privacyLink: {
      alignSelf: 'center',
      color: colors.textColor,
      textDecorationLine: 'underline',
      fontSize: hp('2.3%'),
      marginTop: hp('8%'),
    }
    
  });
  