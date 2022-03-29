import { StyleSheet, Dimensions } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from './colors.js'

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

export default StyleSheet.create({
    loadingTab: {
        flex: 1,
        width: wp('100%'),
        height: hp('85%'),
        position: 'absolute',
        top: hp('22%'),
        left: wp('0%'),
    },

    cover: {
        opacity: 0.2,
        backgroundColor: colors.bodyBackground,
        height: hp('78%'),
        width: wp('100%'),
        position: 'absolute',
        left: 0
    },

    loadingTabText: {
        fontSize: hp('3%'),
        color: colors.textColor,
        backgroundColor: colors.appColor,
        width: '70%',
        height: '10%',
        textAlign: 'center',
        padding: '5%',
        left: '15%',
        position: 'absolute',
        top: '35%',
        opacity: 1
    },

    tableOfContents: {
        width: '100%',
        height: '80%',
        top: hp('20%'),
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        alignItems: 'center',
    },

    content: {
        width: '40%',
        height: '25%',
        marginBottom: '10%',
        borderRadius: 25,
        top: '10%',
        backgroundColor: colors.appColor,
        alignContent: 'center',
        justifyContent: 'center'
    },

    contentIcons: {
        height: '45%',
        alignSelf: 'center',
    },

    contentText: {
        color: colors.textColor,
        fontSize: hp('2%'),
        textAlign: 'center',
        width: '100%',
        top: '30%',
        alignSelf: 'flex-end'
    },

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

    nullText: {
        fontSize: hp('3%'),
        width: '100%',
        color: colors.appColor,
        textAlign: 'center',
        // top: hp('35%')
    },

    newsCont: {
        width: '90%',
        position: 'relative',
        top: '1%',
        left: '5%',
        marginBottom: '10%',
    },

    StaticInfo: {
        top: hp('0%'),
        width: '90%',
        fontSize: hp('3%'),
        width: '100%',
        color: colors.appColor,
        textAlign: 'left',
        left: '5%',
        marginBottom: '5%',
        fontSize: hp('2.5%'),
        color: colors.grey,
    },

    topic: {
        fontSize: hp('3%'),
        width: '100%',
        height: hp('4%'),
        color: colors.appColor,
        textAlign: 'left',
        textDecorationLine: 'underline'
    },

    body: {
        fontSize: hp('2.5%'),
        width: '100%',
        color: colors.grey,
        textAlign: 'left',
    },

})