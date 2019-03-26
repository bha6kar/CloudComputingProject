import { signInAPI } from "../app/api"
import { auth } from "../app/api"
const axios = require('axios')


const LOGIN_PENDING = 'LOGIN_PENDING';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';

//below are action creators
function setLoginPending(isLoginPending) {
    return {
        type: LOGIN_PENDING,
        isLoginPending
    };
}

function setLoginSuccess(isLoginSuccess) {
    return {
        type: LOGIN_SUCCESS,
        isLoginSuccess
    };
}

function setLoginError(loginError) {
    return {
        type: LOGIN_ERROR,
        loginError
    };
}

export function login(email, password) {
    return dispatch => {
        dispatch(setLoginPending(true));
        dispatch(setLoginSuccess(false));
        dispatch(setLoginError(null));

        signInAPI(email, password)
            .then(success => {
                var token = 'Bearer ' + success.data.data.token;
                var name = success.data.data.name;
                console.log(token);

                const axiosInstance = axios.create({
                    baseURL: 'http://0.0.0.0:4000/',
                    timeout: 5000,
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json'
                    }
                });
                window.location.href = "http://mrbhaskar.com";
                /*   axiosInstance.get('/crimestat')
                      .then(function (response) { window.location = "http://0.0.0.0:4000/crimestat" })
                      .catch(err => {
                          console.log(err.request._header)
                      }) */

                // var url = redirect_uri + '?state=' + state + '&code=' + token;
                var url = "http://0.0.0.0/crimestat";
                // window.location.href = url;

            })
            .catch(err => {
                dispatch(setLoginPending(false));
                dispatch(setLoginError(new Error('Invalid email or password')));
            });
    };
}

export default function reducer(state = {
    isLoginPending: false,
    isLoginSucces: false,
    loginError: null
}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoginSuccess: action.isLoginSuccess
            };
        case LOGIN_PENDING:
            return {
                ...state,
                isLoginPending: action.isLoginPending
            };
        case LOGIN_ERROR:
            return {
                ...state,
                loginError: action.loginError
            };
        default:
            return state;
    }
}