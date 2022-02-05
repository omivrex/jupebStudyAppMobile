import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import * as network from 'expo-network';
import * as firebase from 'firebase';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert
} from 'react-native';

import styles from '../styles/master.js';
import GenInfoComponent from '../components/genInfo.js';

const data = []

require('firebase/firestore')
require('firebase/storage')
require('firebase/database')

const firebaseConfig = {
  apiKey: "AIzaSyDzkEuiLvUrNZYdU6blvHgVoHBf2tniZO0",
  authDomain: "jupebstudyapp.firebaseapp.com",
  projectId: "jupebstudyapp",
  storageBucket: "jupebstudyapp.appspot.com",
  messagingSenderId: "316815533405",
  appId: "1:316815533405:web:b0e02fdcf37e5c5cf8b4b4",
  measurementId: "G-XFLZXCNJ44"
};

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

  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore()
  const [genInfoComp, setgenInfoComp] = useState()

  useEffect(() => {
    console.log('runiing use effect...');
    const getGenInfo = async () => {
      try {
        const networkStat = await network.getNetworkStateAsync()
        if (networkStat.isInternetReachable) { //if internet is reachable and new isn't updated and no card is displayed
          Alert.alert('','Obtaining News...', [])
          await db.collection('General Information').get().then((snapShot)=> {
              snapShot.forEach(doc => {
                data.push(doc.data())
              });
          }).then(()=> {
            Alert.alert('', 'News Updated...')
            console.log('data', data);
            newsObtained = true
            setgenInfoComp(<GenInfoComponent data={data}/>)
          })
        }
      } catch (error) { //errors usually show up because there's no network (can not get network state)
          alert('we are having trouble reaching our server. Are you offline?')
          console.error(error)
      }
    };

    getGenInfo()

  }, []);

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
      {genInfoComp}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}