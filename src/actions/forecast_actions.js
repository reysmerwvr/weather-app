import axios from 'axios';
import { handleError, 
    retrieveActionCreator, 
    defaultErrorMessage 
} from '../helpers/general';
import {
    LOAD_FORECAST,
    LOAD_FORECAST_SUCCESS,
    LOAD_FORECAST_ERROR,
} from './types';

const envVars = {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_CONTENT_TYPE_HEADER: process.env.REACT_APP_CONTENT_TYPE_HEADER,
    REACT_APP_ACCEPT_HEADER : process.env.REACT_APP_ACCEPT_HEADER
};

let errorMessage = defaultErrorMessage;

export function loadForecast({ lat, lng, name, id, findBy }) {
    return function (dispatch) {
        dispatch({ type: LOAD_FORECAST });
        axios({
            method: 'post',
            url: `${envVars.REACT_APP_API_URL}/forecasts`,
            data: {
                city_name: name,
                city_id: id,
                coordinates: { latitude: lat, longitude: lng },
                find_by: findBy
            },
            headers: {
                'Content-Type': envVars.REACT_APP_CONTENT_TYPE_HEADER,
                Accept: envVars.REACT_APP_ACCEPT_HEADER
            }
        }).then((response) => {
            const forecastResponse = response.data.data;
            dispatch(retrieveActionCreator(LOAD_FORECAST_SUCCESS, forecastResponse));
        }).catch((error) => {
            handleError(error);
            if (error !== undefined) {
                const errorResponse = error.response.data;
                if (errorResponse) {
                    errorMessage = errorResponse.message
                }
            }
            dispatch(retrieveActionCreator(LOAD_FORECAST_ERROR, errorMessage));
        });
    };
}