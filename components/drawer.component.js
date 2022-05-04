import React, {useState, useEffect}from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Platform } from 'react-native-web';

import styles from '../styles/master.js';

export default function drawerComp({navigation}) {
  const Home = () => {
    navigation.navigate('Home')
  }

  const Register = () => {
    navigation.navigate('Register')
  }

  const navToCalCGPA = () => {
    navigation.navigate('calcScreen')
  }

  const RateProg = () => {
    navigation.navigate('RateProg')
  }

  const Settings = () => {
    navigation.navigate('Settings')
  }

  const Help = () => {
    navigation.navigate('Help')
  }

  const About = () => {
    navigation.navigate('About')
  }

  const pqNav = () => {
    navigation.navigate('PqScreen')
  }

  const navToStartPrac = () => {
    navigation.navigate('StartPrac')
  }
  
  const [greeting, setgreeting] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour<= 12) {
      setgreeting('Good Morning!')
    } else if (hour>=12 && hour<=16) {
      setgreeting('Good Afternoon!')
    } else {
      setgreeting('Good Evening!')
    }
  }, []);
  
  return (
    <View style={styles.menu}>
      <Text style={{
        top: hp('10%'),
        alignSelf: 'center',
        color: '#fff',
        fontSize: hp('3%'),
        paddingVertical: Platform.OS === 'web'? '7.5%':0,
        margin: Platform.OS !== 'web'?0:'auto',
      }}>{greeting}</Text>
      <TouchableOpacity style={styles.menuItemCont} onPress={Home}>
        <Text style={Platform.OS !== 'web'? styles.menuText:{flexDirection: 'row', color: '#eee',  display: 'flex', alignContent: 'center'}}>
          {Platform.OS !== 'web'? <Image resizeMode={'center'} style={styles.icon} source={require('../icons/home.png')}/>: <img width={25} height={25} style={{marginLeft: '8%'}} src={require('../icons/home.png')}/>}
          <Text style={Platform.OS==='web'?{margin:'auto'}:{}}>Home</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItemCont} onPress={pqNav}>
        <Text style={Platform.OS !== 'web'? styles.menuText:{flexDirection: 'row', color: '#eee',  display: 'flex', alignContent: 'center'}}>
          {Platform.OS !== 'web'? <Image resizeMode={'center'} style={styles.icon} source={require('../icons/pQIcon2.png')}/>: <img width={25} height={25} style={{marginLeft: '8%'}} src={require('../icons/pQIcon2.png')}/>}
          <Text style={Platform.OS==='web'?{margin:'auto'}:{}}>Past Questions</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuItemCont]} onPress={Register}>
        <Text style={Platform.OS !== 'web'? styles.menuText:{flexDirection: 'row', color: '#eee',  display: 'flex', alignContent: 'center'}}>
          {Platform.OS !== 'web'? <Image resizeMode={'center'} style={[styles.icon]} source={require('../icons/pay.png')}/>: <img width={25} height={25} style={{marginLeft: '8%'}} src={require('../icons/pay.png')}/>}
          <Text style={Platform.OS==='web'?{margin:'auto'}:{}}>Payment</Text>
        </Text>
      </TouchableOpacity>
        
      <TouchableOpacity style={styles.menuItemCont} onPress={navToStartPrac}>
        <Text style={Platform.OS !== 'web'? styles.menuText:{flexDirection: 'row', color: '#eee',  display: 'flex', alignContent: 'center'}}>
          {Platform.OS !== 'web'? <Image resizeMode={'center'} style={styles.icon} source={require('../icons/startPrac.png')}/>: <img width={25} height={25} style={{marginLeft: '8%'}} src={require('../icons/startPrac.png')}/>}
          <Text style={Platform.OS==='web'?{margin:'auto'}:{}}>Start Practice</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuItemCont]} onPress={RateProg}>
        <Text style={Platform.OS !== 'web'? styles.menuText:{flexDirection: 'row', color: '#eee',  display: 'flex', alignContent: 'center'}}>
          {Platform.OS !== 'web'? <Image resizeMode={'center'} style={[styles.icon]} source={require('../icons/rateProgress.png')}/>: <img width={25} height={25} style={{marginLeft: '8%'}} src={require('../icons/rateProgress.png')}/>}
          <Text style={Platform.OS==='web'?{margin:'auto'}:{}}>Rate Progress</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItemCont} onPress={navToCalCGPA}>
        <Text style={Platform.OS !== 'web'? styles.menuText:{flexDirection: 'row', color: '#eee',  display: 'flex', alignContent: 'center'}}>
          {Platform.OS !== 'web'? <Image resizeMode={'center'} style={[styles.icon]} source={require('../icons/cgpaIcon.png')}/>: <img width={25} height={25} style={{marginLeft: '8%'}} src={require('../icons/cgpaIcon.png')}/>}
          <Text style={Platform.OS==='web'?{margin:'auto'}:{}}>Point Calculator</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItemCont} onPress={Settings}>
        <Text style={Platform.OS !== 'web'? styles.menuText:{flexDirection: 'row', color: '#eee',  display: 'flex', alignContent: 'center'}}>
          {Platform.OS !== 'web'? <Image resizeMode={'center'} style={[styles.icon]} source={require('../icons/settings.png')}/>: <img width={25} height={25} style={{marginLeft: '8%'}} src={require('../icons/settings.png')}/>}
          <Text style={Platform.OS==='web'?{margin:'auto'}:{}}>Settings</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItemCont} onPress={Help}>
        <Text style={Platform.OS !== 'web'? styles.menuText:{flexDirection: 'row', color: '#eee',  display: 'flex', alignContent: 'center'}}>
          {Platform.OS !== 'web'? <Image resizeMode={'center'} style={[styles.icon]} source={require('../icons/help.png')}/>: <img width={25} height={25} style={{marginLeft: '8%'}} src={require('../icons/help.png')}/>}
          <Text style={Platform.OS==='web'?{margin:'auto'}:{}}>Help</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItemCont} onPress={About}>
        <Text style={Platform.OS !== 'web'? styles.menuText:{flexDirection: 'row', color: '#eee',  display: 'flex', alignContent: 'center'}}>
          {Platform.OS !== 'web'? <Image resizeMode={'center'} style={[styles.icon]} source={require('../icons/info.png')}/>: <img width={25} height={25} style={{marginLeft: '8%'}} src={require('../icons/info.png')}/>}
          <Text style={Platform.OS==='web'?{margin:'auto'}:{}}>About</Text>
        </Text>
      </TouchableOpacity>
    </View>
  )
}