import axios from 'axios';
import { handleError, 
    retrieveActionCreator, 
    defaultErrorMessage 
} from '../helpers/general';
import {
    GET_TEMPERATURES,
    GET_TEMPERATURES_SUCCESS,
    GET_TEMPERATURES_ERROR
} from './types';

const envVars = {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_CONTENT_TYPE_HEADER: process.env.REACT_APP_CONTENT_TYPE_HEADER,
    REACT_APP_ACCEPT_HEADER : process.env.REACT_APP_ACCEPT_HEADER
};

let errorMessage = defaultErrorMessage;

export function getTemperatures() {
    return function (dispatch) {
        dispatch({ type: GET_TEMPERATURES });
        axios({
            method: 'get',
            url: `${envVars.REACT_APP_API_URL}/temperatures`,
            headers: {
                'Content-Type': envVars.REACT_APP_CONTENT_TYPE_HEADER,
                Accept: envVars.REACT_APP_ACCEPT_HEADER,
                Authorization: localStorage.getItem('token')
            }
        }).then((response) => {
            const temperaturesResponse = response.data.data;
            dispatch(retrieveActionCreator(GET_TEMPERATURES_SUCCESS, temperaturesResponse));
        }).catch((error) => {
            handleError(error);
            if (error !== undefined) {
                const errorResponse = error.response.data;
                if (errorResponse) {
                    errorMessage = errorResponse.message
                }
            }
            dispatch(retrieveActionCreator(GET_TEMPERATURES_ERROR, errorMessage));
        });
    };
}