import React from 'react';
import styles from '../styles/master.js';
import pageStyles from '../styles/newsFeedStyles.js';
import {
    Text,
    View,
    Image,
    FlatList
} from 'react-native';

const data = []

function GenInfoComponent({data}) {
    if (!data.length) { //if there are no new info in this section //if there are no new info in this section
        return (
            <View style={styles.container}>
                <View style={pageStyles.card}>
                    <Text style={pageStyles.header}>GENERAL INFORMATION</Text>
                    <Image style={pageStyles.contentIcons} resizeMode={'center'} source={require('../icons/empty.png')}/>
                    <Text style={pageStyles.nullText}>
                        Nothing to see here yet.
                    </Text>
                    <Text style={pageStyles.nullText}>
                        Try Refreshing To See Updates!
                    </Text>
                </View>
            </View>
        )
    } else {
        return (
            <View style={pageStyles.card}>
                <Text style={pageStyles.header}>GENERAL INFORMATION</Text>
                <View style={{flex: 1}}>
                    <FlatList
                        data={data}
                        contentContainerStyle = {{paddingBottom: 200}}
                        renderItem={({item}) => (
                            <View style={pageStyles.newsCont}>
                                <Text style={pageStyles.topic}>{item.Topic}:</Text>
                                <Text style={pageStyles.body}>{item.Body}</Text>
                            </View>
                        )}
                        keyExtractor = {item => item.Topic}
                    />
                </View>
            </View>
        )

    }
}

export default GenInfoComponent;