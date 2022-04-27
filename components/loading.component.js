import React from "react";
import { StyleSheet, View, Text } from "react-native";
import LottieView from "lottie-react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from '../styles/colors.js'
import Lottie from "lottie-react";
import { Platform } from "react-native";

const styles = StyleSheet.create({
    animation: {
      width: '100%',
      height: '100%',
    },
    componentWrapper: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(105, 105, 105, 0.5)',
      justifyContent: 'center'
    },

    animationWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '20%',
    },

    loadingText: {
      fontSize: hp('2.9%'),
      textAlign: 'center',
      width: '100%',
      color: colors.appColor
    }
});

const LoadingComponent = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.componentWrapper}>
          <View style={styles.animationWrapper}>
            <Lottie
              source={require("../assets/ripple-loading.json")}
              style={{width: '100%', height: '100%'}}
              autoPlay
            />
            <Text style={styles.loadingText}>Loading</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.componentWrapper}>
          <View style={styles.animationWrapper}>
            <LottieView
              source={require("../assets/ripple-loading.json")}
              style={styles.animation}
              autoPlay
            />
            <Text style={styles.loadingText}>Loading</Text>
          </View>
        </View>
      );
    }
}

export default LoadingComponent