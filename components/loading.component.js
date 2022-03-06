import React from "react";
import { StyleSheet, View, Text } from "react-native";
import LottieView from "lottie-react-native";

const styles = StyleSheet.create({
    animation: {
      width: 100,
      height: 100,
    },
});

const LoadingComponent = () => {
    return (
      <View>
        <LottieView
          source={require("../assets/square-loading.json")}
          style={styles.animation}
          autoPlay
        />
      </View>
    );
}

export default LoadingComponent