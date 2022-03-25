import React, {useEffect, useState, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import * as network from 'expo-network';
import * as firebase from 'firebase';
import colors from '../styles/colors.js'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  TouchableHighlight,
  BackHandler,
} from 'react-native';

import styles from '../styles/master.js';
import GenInfoComponent from '../components/genInfo.js';


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

const genInfoPrevContStyle = {
  backgroundColor: '#fff',
  width: '100%',
  height: '100%',
}

const previewInformationStyle = {
  color: colors.appColor,
  paddingLeft: wp('2.5%'),
  fontSize: hp('2.5%'),
  marginBottom: hp('2%')
}

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
  const [genInfoPreview, setgenInfoPreview] = useState(
    <View style={[genInfoPrevContStyle]}>
      <Text style={[previewInformationStyle, {width: '100%', textAlign: 'center'}]}>Loading...</Text>
    </View>
  )
  
  BackHandler.addEventListener('hardwareBackPress', function () {
    if(isGenInfoCompDisplayed){
      setgenInfoComp()
      isGenInfoCompDisplayed = false
      return true
    }
    false
  })
  
  const data = useRef([]);
  
  useEffect(() => {
    const getGenInfo = async () => {
      try {
        const networkStat = await network.getNetworkStateAsync()
        if (networkStat.isInternetReachable) {
          await db.collection('General Information').get().then((snapShot)=> {
              snapShot.forEach(doc => {
                const info = doc.data()
                info.id = doc.id
                data.current.push(info)
              });
          }).then(()=> {
            if (data.current.length>0) {
              console.log(data.current);
              setgenInfoPreview(
                <FlatList 
                  data={data.current}
                  keyExtractor={item => item.id}
                  contentContainerStyle = {genInfoPrevContStyle}
                  renderItem={({item}) => (
                    <>
                      <Text style={previewInformationStyle}>- {item.Topic}</Text>
                    </>
                  )}
                />
              )
            } else {
              setgenInfoPreview(
                <View style={[genInfoPrevContStyle]}>
                  <Text style={[previewInformationStyle, {width: '100%', textAlign: 'center'}]}>No recent information</Text>
                </View>
              )
            }
          })
        } else {
          setgenInfoPreview(
            <View style={[genInfoPrevContStyle]}>
              <Text style={[previewInformationStyle, {width: '100%', textAlign: 'center'}]}>No recent information</Text>
            </View>
          )
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
          <View style={styles.blockWrapper}>
            <TouchableHighlight underlayColor={colors.underlayColor} style={styles.block} onPress={navToPqPage}>
              <>
                <Image resizeMode={'center'} style={[styles.blockIcon]} source={require('../icons/pQIcon.png')}/>
                <Text style={styles.blockText}>PAST QUESTIONS</Text>
              </>
            </TouchableHighlight>

            <TouchableHighlight underlayColor={colors.underlayColor} style={styles.block} onPress={navToNewsPage}>
              <>
                <Image resizeMode={'center'} style={[styles.blockIcon]} source={require('../icons/newsIcon.png')}/>
                <Text style={[styles.blockText]}>NEWS {'&'} RESOURCES</Text>
              </>
            </TouchableHighlight>

            <TouchableHighlight underlayColor={colors.underlayColor} style={styles.block} onPress={navToCalcPage}>
              <>
                <Image resizeMode={'center'} style={[styles.blockIcon]} source={require('../icons/cgpaIcon.png')}/>
                <Text style={[styles.blockText]}>POINT CALCULATOR</Text>
              </>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={colors.underlayColor} style={styles.block} onPress={navToCalcPage}>
              <>
                <Image resizeMode={'center'} style={[styles.blockIcon]} source={require('../icons/cgpaIcon.png')}/>
                <Text style={[styles.blockText]}>POINT CALCULATOR</Text>
              </>
            </TouchableHighlight>
          </View>
        </ScrollView>
        <TouchableHighlight underlayColor={colors.underlayColor} onPress={()=> {
          isGenInfoCompDisplayed = true
          setgenInfoComp(<GenInfoComponent data={data.current}/>)
        }} style={[
          styles.block,
          {
            // height: hp('25%'),
            width: wp('90%'),
            flex: 0.5
          }
        ]}>
          <>
            <Text style={{
              alignSelf: 'flex-start',
              color: colors.textColor,
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
              backgroundColor: colors.backgroundColor,
              borderColor: colors.appColor
            }}>
              {genInfoPreview}
            </View>
          </>
        </TouchableHighlight>
      </View>
      {genInfoComp}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}