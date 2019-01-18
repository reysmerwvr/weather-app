import {
    LOAD_FORECAST,
    LOAD_FORECAST_SUCCESS,
    LOAD_FORECAST_ERROR,
    CLEAR_MESSAGES
} from '../actions/types';

const INITIAL_STATE = {
    forecast: null,
    error: null,
    success: null,
    loading: false,
};

const forecastReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOAD_FORECAST:
            return { ...state, loading: true, error: null };
        case LOAD_FORECAST_ERROR:
            return { ...state, loading: false, error: action.payload };
        case LOAD_FORECAST_SUCCESS:
            return { 
                ...state, 
                ...INITIAL_STATE, 
                success: action.payload.message, 
                forecast: action.payload.data 
            };
        case CLEAR_MESSAGES:
            return { ...state, error: null, success: null };
        default:
            return state;
    }
};

export default forecastReducer;
