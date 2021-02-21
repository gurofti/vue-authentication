import {
    AUTH_ACTION, AUTO_LOGIN_ACTION, AUTO_LOGOUT_ACTION,
    LOGIN_ACTION,
    LOGOUT_ACTION, SET_AUTO_LOGOUT_MUTATION,
    SET_USER_TOKEN_DATA_MUTATION,
    SIGNUP_ACTION
} from "@/store/storeconstants";
import axios from "axios";
import SignupValidations from "@/services/SignupValidations";

let timer = ''
export default {
    [LOGOUT_ACTION](context) {
        context.commit(SET_USER_TOKEN_DATA_MUTATION, {
            email: null,
            token: null,
            expiresIn: null,
            refreshToken: null,
            userId: null,
        })
        localStorage.removeItem('userData')
        if (timer) {
            clearTimeout(timer)
        }
    },

    [AUTO_LOGOUT_ACTION](context) {
        context.dispatch(LOGOUT_ACTION)
        context.commit(SET_AUTO_LOGOUT_MUTATION)
    },

    async [LOGIN_ACTION](context, payload) {
        return context.dispatch(AUTH_ACTION, {
            ...payload,
            url: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCaPeWwmUvHCNUKeLCbmgeCyPTwJVfzbqk'
        })
    },

    async [SIGNUP_ACTION](context, payload) {
        return context.dispatch(AUTH_ACTION, {
            ...payload,
            url: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCaPeWwmUvHCNUKeLCbmgeCyPTwJVfzbqk'
        })
    },

    [AUTO_LOGIN_ACTION](context) {
        let userDataString = localStorage.getItem('userData')
        if (userDataString) {
            let userData = JSON.parse(userDataString)
            let expirationTime = userData.expiresIn - new Date().getTime()

            if (expirationTime < 10000) {
                context.dispatch(AUTO_LOGOUT_ACTION)
            } else {
                timer = setTimeout(() => {
                    context.dispatch(AUTO_LOGOUT_ACTION)
                }, expirationTime)
            }
            context.commit(SET_USER_TOKEN_DATA_MUTATION, JSON.parse(userData))
        }
    },

    async [AUTH_ACTION](context, payload) {
        let postData = {
            email: payload.email,
            password: payload.password,
            returnSecureToken: true
        }
        let response = ''
        try {
            response = await axios.post(payload.url,
                postData)
        } catch (err) {
            throw SignupValidations.getErrorMessageFromCode(
                err.response.data.error.errors[0].message
            )
        }

        if (response.status === 200) {
            let expirationTime = +response.data.expiresIn * 1000
            timer = setTimeout(() => {
                context.dispatch(AUTO_LOGOUT_ACTION)
            }, expirationTime)

            let tokenData = {
                email: response.data.email,
                token: response.data.idToken,
                expiresIn: response.data.expiresIn,
                refreshToken: response.data.refreshToken,
                userId: response.data.localId,
            }
            localStorage.setItem('userData', JSON.stringify(tokenData))
            context.commit(SET_USER_TOKEN_DATA_MUTATION, tokenData)
        }
        console.log(response)
    },
}