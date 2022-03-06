import {firestoreDB} from "../utils/firebase.config"

export const sendGetCollectionReq = (collectionName, returnId) => {
    const collectionData = []
    console.log(collectionName)
    return new Promise((resolve, reject) => {
        firestoreDB.collection(collectionName).get().then((snapShot)=> {
            snapShot.forEach(doc => {
                returnId?collectionData.push({Data:doc.data(), id:doc.id}):collectionData.push(doc.data())
            });
            resolve(collectionData)
        }).catch (err => {
            reject(err)
        })
    })
}