import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Text, View, ScrollView, Linking, TouchableOpacity, SafeAreaView, Image} from 'react-native';

import styles from '../styles/master.js';
import pageStyles from '../styles/newsFeedStyles.js';

export default function About({navigation}) {
    function openMenu () {
        navigation.openDrawer();
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCont}>
                <Text style={styles.baseText}>ABOUT</Text>
                <TouchableOpacity style={styles.menuIcon} onPress={openMenu}>
                    <Image source={require('../icons/menuIcon.png')}/>
                </TouchableOpacity>
            </View>
            <View style={[pageStyles.card, { left: -30, top: hp('17%')}]}>
                <ScrollView style={{height: hp('90%'), marginBottom: 50, marginTop: 30}}>
                    <ScrollView horizontal={true}>
                        <Text style={pageStyles.StaticInfo}>
                            The Joint Universities Preliminary Examination                        {'\n'}
                            Board (JUPEB) programme is reputed to be quite                        {'\n'}
                            tough, competitive and fast-paced for candidates                          {'\n'}
                            seeking admission into Nigerian and foreign                       {'\n'}
                            universities through Direct Entry. No doubt,                          {'\n'}
                            it is the desire of every student preparing                           {'\n'}
                            to write the annual JUPEB A-level Examination                         {'\n'}
                            to be successful therein, in order to achieve                         {'\n'}
                            their dream of higher education. Therefore,                           {'\n'}
                            it is necessary that the candidate be                         {'\n'}
                            adequately equipped to face the battle ahead.                         {'\n'}
                            {'\n'}                                      {'\n'}
                            This software has been carefully and specially                        {'\n'}
                            prepared to meet the needs of both students                           {'\n'}
                            and tutors preparing for the 'almighty'                           {'\n'}
                            JUPEB exams. It covers a variety of recurring                         {'\n'}
                            A-level exam topics in Mathematics, Physics,                          {'\n'}
                            Chemistry and Biology.                                      {'\n'}
                            {'\n'}                                      {'\n'}
                            This JUPEB solution set is replete with                           {'\n'}
                            comprehensively accurate solutions to past                        {'\n'}
                            questions since the inception of the exam in                          {'\n'}
                            2018. It gives a detailed explanation of                          {'\n'}
                            answers to questions in the multiple                          {'\n'}
                            choice (OBJ) section, as well as the                          {'\n'}
                            theory section. Each answer is presented                          {'\n'}
                            in a clear handwritten font in order to                           {'\n'}
                            minimize typographical errors, so as to                           {'\n'}
                            give the reader a better understanding.                       {'\n'}
                            {'\n'}                                      {'\n'}
                            In addition, graphical illustrations,                         {'\n'}
                            diagrammatical representations,  statistical                          {'\n'}
                            tables, fundamental differential and integral                         {'\n'}
                            tables, including trigonometric and logarithm                         {'\n'}
                            tables have been provided, for maximum                        {'\n'}
                            revision, concentration and assimilation.                         {'\n'}
                            {'\n'}                                      {'\n'}
                            In short, this software will give a rich                          {'\n'}
                            taste of intellectual sagacity to the                         {'\n'}
                            JUPEB candidate, because it was prepared                          {'\n'}
                            by a team of seasoned and experienced                         {'\n'}
                            tutors who, using their prized knowledge,                         {'\n'}
                            have helped many students gain admission                          {'\n'}
                            into Nigerian higher institutions.                        {'\n'}
                            No doubt, you could be the next!                          {'\n'}
                            {'\n'}                                      {'\n'}
                            Remember, with dedication, hard work,                         {'\n'}
                            being at the right place and doing the                        {'\n'}
                            right thing at the right time, success                        {'\n'}
                            will be yours for the taking.                            {'\n'}
                            {'\n'}
                            Good luck in your exams! {'\n'}
                            For our privacy policy check out this {' '}
                            <Text style={{color: 'blue', textDecorationLine: 'underline'}} onPress={()=> {Linking.openURL('https://www.privacypolicies.com/live/a9c5604c-4991-4768-a93a-3819c9eb688b')}}>
                                Link
                            </Text>
                        </Text>
                    </ScrollView>
                </ScrollView>
            </View>
            <StatusBar style="light" />
        </SafeAreaView>

    )
    
}