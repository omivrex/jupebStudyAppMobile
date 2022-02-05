import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

import styles from '../styles/master.js';

export default function homeScreen({navigation}) {
  function openMenu () {
    navigation.openDrawer();
  }

  const navToPqPage = () => {
    navigation.navigate('PqScreen')
  }

  const navToNewsPage = () => {
    navigation.navigate('NewsScreen')
  }
   
  const navToCalcPage = () => {
    navigation.navigate('CalcScreen')
  }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerCont}>
          <Image style={styles.logoImage} resizeMode={'center'} source={require('../icons/headerIcon.png')}/>
          <TouchableOpacity style={styles.menuIcon} onPress={openMenu}>
            <Image source={require('../icons/menuIcon.png')}/>
          </TouchableOpacity>
        </View>
  
        <View style={styles.body}>
          <ScrollView style={styles.scrollView}>
              <TouchableOpacity style={styles.block} onPress={navToPqPage}>
                <Image resizeMode={'center'} style={[styles.blockIcon]} source={require('../icons/pQIcon.png')}/>
                <Text style={styles.blockText}>PAST QUESTIONS</Text>
              </TouchableOpacity>
  
              <TouchableOpacity style={styles.block} onPress={navToNewsPage}>
                <Image resizeMode={'center'} style={[styles.blockIcon]} source={require('../icons/newsIcon.png')}/>
                <Text style={[styles.blockText]}>NEWS {'&'} RESOURCES</Text>
              </TouchableOpacity>
  
              <TouchableOpacity style={styles.block} onPress={navToCalcPage}>
                <Image resizeMode={'center'} style={[styles.blockIcon]} source={require('../icons/cgpaIcon.png')}/>
                <Text style={[styles.blockText]}>POINT CALCULATOR</Text>
              </TouchableOpacity>
          </ScrollView>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }