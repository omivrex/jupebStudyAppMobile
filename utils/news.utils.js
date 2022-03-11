import {firestoreDB} from "../utils/firebase.config"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSectionData = (section, sectionArray) => {
    try {
        firestoreDB.collection(section).get().then(snapShot=> {
            snapShot.forEach(doc => {
                sectionArray.push(doc.data())
            });
        })
    } catch (err) { //this could happen because internet is reachable but user does not have data thus database will not be reachable
        alert('we are having trouble reaching our server. Are you offline?')
        console.error();
    }
}

export const getToken = async () => {
    if (!is_token_obtained.current) {
        try {
            token = await AsyncStorage.getItem('vpa')
            if (token === 'true') {
                return token
            } else{
                DISPLAY_BLOCKED_FEATURE_CARD()
                return false
            }
        } catch (err) {
            console.log(err);
        }
        is_token_obtained.current = true
    }
}