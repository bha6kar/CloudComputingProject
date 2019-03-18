import { auth } from "../app/api"
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

        auth(email, password)
            .then(success => {

                var token = success.data.refresh_token;
                var url_string = window.location.href;
                var initial_url = new URL(url_string);
                var state = initial_url.searchParams.get("state");
                var redirect_uri = initial_url.searchParams.get("redirect_uri");

                // var url = redirect_uri + '?state=' + state + '&code=' + token;
                var url = "https://github.com";
                window.location.href = url;

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