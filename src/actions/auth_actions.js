import axios from 'axios';
import { handleError, 
    retrieveActionCreator, 
    defaultErrorMessage 
} from '../helpers/general';
import history from '../helpers/history';
import {
    AUTH_USER,
    AUTH_USER_ERROR,
    AUTH_USER_SUCCESS,
    UNAUTH_USER,
} from './types';

const envVars = {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_CONTENT_TYPE_HEADER: process.env.REACT_APP_CONTENT_TYPE_HEADER,
    REACT_APP_ACCEPT_HEADER : process.env.REACT_APP_ACCEPT_HEADER
};

let errorMessage = defaultErrorMessage;

export function signIn({ email, password }) {
    return function (dispatch) {
        dispatch({ type: AUTH_USER });
        axios({
            method: 'post',
            url: `${envVars.REACT_APP_API_URL}/sign-in`,
            data: {
                email,
                password
            },
            headers: {
                'Content-Type': envVars.REACT_APP_CONTENT_TYPE_HEADER,
                Accept: envVars.REACT_APP_ACCEPT_HEADER
            }
        }).then((response) => {
            const loginResponse = response.data.data;
            dispatch(retrieveActionCreator(AUTH_USER_SUCCESS, loginResponse));
            localStorage.setItem('token', loginResponse.token);
            history.push('/dashboard');
        }).catch((error) => {
            handleError(error);
            if (error !== undefined) {
                const errorResponse = error.response.data;
                if (errorResponse) {
                    errorMessage = errorResponse.message
                }
            }
            dispatch(retrieveActionCreator(AUTH_USER_ERROR, errorMessage));
        });
    };
}

export function signOut() {
    return function (dispatch) {
        dispatch({ type: UNAUTH_USER });
        localStorage.removeItem('token');
        history.push('/login');
    };    
}

export function retrieveAuthUser() {
    return function (dispatch) {
        dispatch({ type: AUTH_USER });
        axios({
            method: 'get',
            url: `${envVars.REACT_APP_API_URL}/auth-user`,
            headers: {
                'Content-Type': envVars.REACT_APP_CONTENT_TYPE_HEADER,
                Accept: envVars.REACT_APP_ACCEPT_HEADER,
                Authorization: localStorage.getItem('token')
            }
        }).then((response) => {
            const userResponse = response.data.data;
            dispatch(retrieveActionCreator(AUTH_USER_SUCCESS, userResponse));
        }).catch((error) => {
            handleError(error);
            if (error !== undefined) {
                const errorResponse = error.response.data;
                if (errorResponse) {
                    errorMessage = errorResponse.message
                }
            }
            dispatch(retrieveActionCreator(AUTH_USER_ERROR, errorMessage));
        });
    };
}
