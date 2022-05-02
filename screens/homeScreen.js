import React, {useEffect, useState, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import * as network from 'expo-network';
import {firestoreDB} from "../utils/firebase.config"
import colors from '../styles/colors.js'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  Text,
  View,
  Alert,
  SafeAreaView,
  Image,
  FlatList,
  TouchableHighlight,
  BackHandler,
} from 'react-native';

import styles from '../styles/master.js';
import GenInfoComponent from '../components/genInfo.component.js';
import { Platform } from 'react-native-web';
import WebAlert from '../components/WebAlert.component';

let isGenInfoCompDisplayed = false;

let genInfoPrevContStyle = {
  width: '100%',
  height: '100%',
}

let genInfoHeaderStyle = {
  alignSelf: 'flex-start',
  color: colors.appColor,
  width: '100%',
  textAlign: 'center',
  fontSize: hp('2.6%'),
  fontWeight: '700',
  paddingVertical: '3%',
  zIndex: 5,
}

const previewInformationStyle = {
  borderWidth: 2,
  borderColor: colors.appColor,
  backgroundColor: colors.appColor,
  marginBottom: '2%',
  borderRadius: 15,
  top: '2%',
  marginHorizontal: '5%',
  width: '90%',
  paddingVertical: '2%',
  flexDirection: 'row',
  justifyContent: 'center',
}

const previewInformationTextStyle = {
  color: colors.textColor,
  fontSize: hp('3%'),
  paddingLeft: '5%',
  fontWeight: '500',
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
   
  const navToStartPrac = () => {
    navigation.navigate('StartPrac')
  }

  const [genInfoComp, setgenInfoComp] = useState()
  const [genInfoPreview, setgenInfoPreview] = useState(
    <View style={[genInfoPrevContStyle]}>
      <View style={previewInformationStyle}>
        <Text style={[previewInformationTextStyle, {textAlign: 'center'}]}>Loading...</Text>
      </View>
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
          await firestoreDB.collection('General Information').get().then((snapShot)=> {
              snapShot.forEach(doc => {
                const info = doc.data()
                info.id = doc.id
                data.current.push(info)
              });
          }).then(()=> {
            if (data.current.length>0) {
              setgenInfoPreview(
                <FlatList 
                  data={data.current}
                  keyExtractor={item => item.id}
                  contentContainerStyle = {genInfoPrevContStyle}
                  renderItem={({item, index}) => (
                    <TouchableHighlight underlayColor={colors.textColor} onPress={()=> {
                      isGenInfoCompDisplayed = true
                      setgenInfoComp(<GenInfoComponent data={[data.current[index]]}/>)
                      Platform.OS === 'web'?
                        window.MathJax.typeset()
                      :null
                      console.log('running MathJax')
                    }}>
                      <View style={previewInformationStyle}>
                        <Text style={[previewInformationTextStyle, {alignSelf: 'flex-start', width: '90%'}]}>{item.Topic}</Text>
                        <Image resizeMode={'center'} style={{width: '10%'}} source={require('../icons/next.png')}/>
                      </View>
                    </TouchableHighlight>
                  )}
                />
              )
            } else {
              setgenInfoPreview(
                <View style={[genInfoPrevContStyle]}>
                  <Text style={[previewInformationTextStyle, {width: '100%', textAlign: 'center', color: '#777'}]}>No recent information</Text>
                </View>
              )
            }
          })
        } else {
          setgenInfoPreview(
            <View style={[genInfoPrevContStyle]}>
              <Text style={[previewInformationTextStyle, {width: '100%', textAlign: 'center', color: '#777'}]}>No recent information</Text>
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

  const [webAlert, setwebAlert] = useState()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCont}>
        {Platform.OS !== 'web'?<Image style={styles.logoImage} resizeMode={'contain'} source={require('../icons/headerIcon.png')}/>:<img src={require('../icons/headerIcon.png')} width={90}/>}
        <TouchableHighlight underlayColor = {colors.appColor} style={styles.menuIcon} onPress={openMenu}>
          {Platform.OS !== 'web'?<Image source={require('../icons/menuIcon.png')}/>:<img src={require('../icons/menuIcon.png')} width={100}/>}
        </TouchableHighlight>
      </View>

      <View style={styles.body}>
        <View style={styles.scrollView}>
          <View style={styles.blockWrapper}>
            <TouchableHighlight underlayColor={colors.underlayColor} style={styles.block} onPress={navToPqPage}>
              <>
                <Image resizeMode={'center'} style={[styles.blockIcon]} source={require('../icons/pQIcon.png')}/>
                <Text style={styles.blockText}>PAST QUESTIONS</Text>
              </>
            </TouchableHighlight>

            <TouchableHighlight underlayColor={colors.underlayColor} style={styles.block} onPress={navToStartPrac}>
              <>
                <Image resizeMode={'center'} style={styles.blockIcon} source={require('../icons/startPrac.png')}/>
                <Text style={[styles.blockText]}>START PRACTICE</Text>
              </>
            </TouchableHighlight>

            <TouchableHighlight underlayColor={colors.underlayColor} style={styles.block} onPress={navToNewsPage}>
              <>
                <Image resizeMode={'center'} style={styles.blockIcon} source={require('../icons/newsIcon.png')}/>
                <Text style={[styles.blockText]}>NEWS {'&'} RESOURCES</Text>
              </>
            </TouchableHighlight>

            <TouchableHighlight underlayColor={colors.underlayColor} style={styles.block} onPress={()=> 
            Platform.OS !== 'web'? Alert.alert('', 'Comming Soon...', [{text: 'Ok', onPress: ()=>''}], {cancelable: true}):
            setwebAlert(
              <WebAlert closeFunc={()=> setwebAlert()} title={``} body={`Comming Soon...`}>
                  <TouchableHighlight style={{backgroundColor: colors.appColor, width: '90%', padding: 8, borderRadius: 18, marginBottom: 8.6}} onPress={()=> {
                      setwebAlert()
                  }}>
                      <Text style={{color: '#eee', textAlign: 'center'}}>OK</Text>
                  </TouchableHighlight>
              </WebAlert>
            )
          }>
              <>
                <Image resizeMode={'center'} style={styles.blockIcon} source={require('../icons/lectureNotes.png')}/>
                <Text style={[styles.blockText]}>LECTURE NOTES</Text>
              </>
            </TouchableHighlight>
          </View>
        </View>
        <View style={[
          {
            height: '40%',
            width: '100%',
            alignSelf: 'flex-end',
          }
        ]}>
          <>
            <Text style={genInfoHeaderStyle}>
              General Information
            </Text>
            
            <View style={{
              flexDirection: 'column',
              alignSelf: 'flex-end',
              width: '100%',
              height: '80%',
              backgroundColor: colors.backgroundColor,
            }}>
              {genInfoPreview}
            </View>
          </>
        </View>
      </View>
      {genInfoComp}
      {webAlert}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}