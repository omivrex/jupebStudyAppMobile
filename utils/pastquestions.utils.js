import {firestoreDB} from "../utils/firebase.config"
import AsyncStorage from "@react-native-async-storage/async-storage";
const pqData = require("../scripts/pqData.json");

export const getOnlineCollections = (collectionName, returnId) => {
    const collectionData = []
    return new Promise((resolve, reject) => {
        let maxWaitTime = setTimeout(() => {
            resolve(collectionData)
        }, 5000);
        firestoreDB.collection(collectionName).get().then((snapShot)=> {
            snapShot.forEach(doc => {
                returnId?collectionData.push({data:doc.data().Data, id:doc.id})
                :collectionData.push(doc.data())
            });
            if (collectionData.length>0) {
                clearTimeout(maxWaitTime);
                resolve(collectionData)
            }
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

export const getOfflineCollections = (pathObj) => {
    const collectionData = []
    try {
        if (pathObj) {
            const path = Object.values(pathObj).filter(Boolean) /** remove falsey values */
            let recordToSearch = pqData
            path.forEach((item) => {
                recordToSearch = recordToSearch[item.index].content
            })
            recordToSearch.forEach((item, index)=> {
                const [key] = Object.keys(item)
                const [value] = Object.values(item)
                collectionData.push({[key]: value, index})
            })
        } else {
            pqData.forEach(({courseName}, index) => {
                collectionData.push({courseName, index})
            });
        }
        return collectionData
    } catch (error) {
        console.log('error from getOfflineCollections:', error)
    }
}

export const getSectionsLocalQuestions = (pathObj, questionNumber) => {
    try {
        const questionData = pqData[pathObj.courseName.index]
        .content[pathObj.year.index]
        .content[pathObj.subject.index]
        .content[pathObj.section.index]
        .content[questionNumber.index]
        .content.Data.Data
        return questionData
    } catch (error) {
        console.log(error)
    }

}