import {firestoreDB} from "../utils/firebase.config"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const sendGetCollectionReq = (collectionName, returnId) => {
    const collectionData = []
    return new Promise((resolve, reject) => {
        firestoreDB.collection(collectionName).get().then((snapShot)=> {
            snapShot.forEach(doc => {
                returnId?collectionData.push({data:doc.data().Data, id:doc.id})
                :collectionData.push(doc.data())
            });
            resolve(collectionData)
        }).catch (err => {
            console.log(err)
            reject(err)
        })
    })
}

export const getToken = async (callback) => {
    try {
        let token = await AsyncStorage.getItem('vpa')
        if (token !== 'true') {
            callback(false)
            return false
        } else {
            callback(true)
        }
    } catch (err) {
        console.log(err);
    }
}

