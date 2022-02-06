import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import * as network from 'expo-network';
import * as firebase from 'firebase';
import colors from '../styles/colors.js'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  TouchableHighlight,
  BackHandler,
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

let isGenInfoCompDisplayed = false;

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
  const [genInfoPreview, setgenInfoPreview] = useState()

  BackHandler.addEventListener('hardwareBackPress', function () {
    if(isGenInfoCompDisplayed){
      setgenInfoComp()
      isGenInfoCompDisplayed = false
      return true
    }
    false
  })

  const previewInformationStyle = {
    color: colors.appColor,
    paddingLeft: wp('2.5%'),
    fontSize: hp('2.5%'),
    marginBottom: hp('2%')
  }

  useEffect(() => {
    const getGenInfo = async () => {
      try {
        const networkStat = await network.getNetworkStateAsync()
        if (networkStat.isInternetReachable) {
          await db.collection('General Information').get().then((snapShot)=> {
              snapShot.forEach(doc => {
                data.push(doc.data())
              });
          }).then(()=> {
            if (data.length>0) {
              setgenInfoPreview(
                <FlatList 
                  data={data}
                  contentContainerStyle = {{
                    backgroundColor: '#fff',
                    width: '100%',
                    height: '100%',
                  }}
                  renderItem={({item}) => (
                    <>
                      <Text style={previewInformationStyle}>- {item.Topic}</Text>
                    </>
                  )}
                />
              )
            } else {
              setgenInfoPreview(<Text style={previewInformationStyle}>No recent information</Text>)
            }
          })
        } else {
          setgenInfoPreview(<Text style={previewInformationStyle}>No recent information</Text>)
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
        <Image style={styles.logoImage} resizeMode={'contain'} source={require('../icons/headerIcon.png')}/>
        <TouchableHighlight underlayColor = {colors.appColor} style={styles.menuIcon} onPress={openMenu}>
          <Image source={require('../icons/menuIcon.png')}/>
        </TouchableHighlight>
      </View>

      <View style={styles.body}>
        <ScrollView style={styles.scrollView}>
            <TouchableHighlight onPress={()=> {
              isGenInfoCompDisplayed = true
              setgenInfoComp(<GenInfoComponent data={data}/>)
            }} style={[styles.block, {flexDirection: 'column', height: hp('25%'), width: wp('90%')}]}>
              <>
                <Text style={{
                  alignSelf: 'flex-start',
                  color: '#eee',
                  width: '100%',
                  textAlign: 'center',
                  fontSize: hp('2.6%'),
                  textAlignVertical: 'center',
                  flex: 2,
                  zIndex: 10,
                }}>
                  General Information
                </Text>
                
                <View style={{
                  flexDirection: 'column',
                  alignSelf: 'flex-end',
                  width: '100%',
                  flex: 5,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  backgroungColor: 'red',
                  borderColor: colors.appColor
                }}>
                  {genInfoPreview}
                </View>
              </>
            </TouchableHighlight>
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