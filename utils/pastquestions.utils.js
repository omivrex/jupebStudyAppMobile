import {firestoreDB} from "../utils/firebase.config"

export const sendGetCollectionReq = (collectionName, returnId) => {
    const collectionData = []
    console.log(collectionName)
    return new Promise((resolve, reject) => {
        firestoreDB.collection(collectionName).get().then((snapShot)=> {
            snapShot.forEach(doc => {
                returnId?collectionData.push({data:doc.data().Data, id:doc.id}):collectionData.push(doc.data())
            });
            resolve(collectionData)
        }).catch (err => {
            console.log(err)
            reject(err)
        })
    })
}