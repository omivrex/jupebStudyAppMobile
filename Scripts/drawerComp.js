import React, {useState, useEffect}from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import styles from '../styles/master.js';

export default function drawerComp({navigation}) {
  const Home = () => {
    navigation.navigate('Home')
  }

  const Register = () => {
    navigation.navigate('Register')
  }

  const StartPrac = () => {
    navigation.navigate('StartPrac')
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

  const newsNav = () => {
    navigation.navigate('NewsScreen')
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
      }}>{greeting}</Text>
      <TouchableOpacity style={styles.menuItemCont} onPress={Home}>
        <Text style={styles.menuText}>
          <Image resizeMode={'center'} style={styles.icon} source={require('../icons/home.png')}/>
          <Text>Home</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItemCont} onPress={pqNav}>
        <Text style={styles.menuText}>
          <Image resizeMode={'center'} style={styles.icon} source={require('../icons/pQIcon2.png')}/>
          <Text>Past Questions</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItemCont} onPress={newsNav}>
        <Text style={styles.menuText}>
          <Image resizeMode={'center'} style={styles.icon} source={require('../icons/newsIcon2.png')}/>
          <Text>News {'&'} Resources</Text>
        </Text>
      </TouchableOpacity>
        
      <TouchableOpacity style={[styles.menuItemCont]} onPress={Register}>
        <Text style={styles.menuText}>
          <Image resizeMode={'center'} style={[styles.icon]} source={require('../icons/pay.png')}/>
          <Text>Payment</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItemCont} onPress={StartPrac}>
        <Text style={styles.menuText}>
          <Image resizeMode={'center'} style={[styles.icon]} source={require('../icons/startPrac.png')}/>
          <Text>Start Practice</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuItemCont]} onPress={RateProg}>
        <Text style={styles.menuText}>
          <Image resizeMode={'center'} style={[styles.icon]} source={require('../icons/rateProgress.png')}/>
          <Text>Rate Progress</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItemCont} onPress={Settings}>
        <Text style={styles.menuText}>
          <Image resizeMode={'center'} style={[styles.icon]} source={require('../icons/settings.png')}/>
          <Text>Settings</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItemCont} onPress={Help}>
        <Text style={styles.menuText}>
          <Image resizeMode={'center'} style={[styles.icon]} source={require('../icons/help.png')}/>
          <Text>Help</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItemCont} onPress={About}>
        <Text style={styles.menuText}>
          <Image resizeMode={'center'} style={[styles.icon]} source={require('../icons/info.png')}/>
          <Text>About</Text>
        </Text>
      </TouchableOpacity>
    </View>
  )
}