import AsyncStorage from "@react-native-async-storage/async-storage";
import {database} from "./firebase.config"
const paymentRequests = database.ref('paymentRequests')
const users = database.ref('users')

export const sendPaymentRequest = async (callback, errorHandler, userData) => {
    userData.email = await AsyncStorage.getItem('userEmail')
    try {
        users.orderByChild('email').equalTo(userData.email).on('value', snapshot => {
            if (snapshot !== null) {
                let [uid] = Object.keys(snapshot.val()) //use auth uid as key in rtdb
                paymentRequests.child(uid).set({...userData, paymentDate: new Date().getTime()})
                .then(callback())
            }
        })
    } catch (error) {
        errorHandler()
    }
}

export const validatePayment = async (pin, errorHandler, successHandler) => {
    try {
        const userEmail = await AsyncStorage.getItem('userEmail')
        if (userEmail) {
            const query = users.orderByChild('email').equalTo(userEmail).limitToFirst(1)
            let uid
            query.once('value', async snapshot => {
                [uid] = Object.keys(snapshot.val())
                const IS_PIN_CORRECT = await checkPin(pin, uid, errorHandler)

                if (IS_PIN_CORRECT) {
                    users.child(uid).update({vpa: true, dateValidated: new Date().getTime()}).then( async () => {
                        await AsyncStorage.setItem('vpa', 'true')
                        await paymentRequests.child(uid).remove()
                        successHandler()
                    })
                }
                
            })
        }
    } catch (error) {
        errorHandler()
    }
}

const checkPin = async  (pin, uid, errorHandler) => {
    try {
        let is_payment_validated = false
        if (pin) {
            await paymentRequests.child(uid).once('value', snapshot => {
                if (snapshot.val()) {
                    if (pin === snapshot.val().currentPin) {
                        console.log(pin === snapshot.val().currentPin);
                        is_payment_validated = true
                    } else {
                        errorHandler('Incorrect Pin')
                    }
                } else {
                    errorHandler( "You haven't sent any payment request")
                }
            })
        } else { /* this is incase user uses card activation instead of pin */
            is_payment_validated = true /** because the payment is validated by paystack we simply just set is_payment_validated to true */
        }
        return is_payment_validated
    } catch (error) {
        errorHandler()
    }
}