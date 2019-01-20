import {
    GET_TEMPERATURES,
    GET_TEMPERATURES_SUCCESS,
    GET_TEMPERATURES_ERROR
} from '../actions/types';

const INITIAL_STATE = {
    temperaturesList: null,
    error: null,
    loading: false,
};

const temperaturesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_TEMPERATURES:
            return { ...state, loading: true, error: null };
        case GET_TEMPERATURES_ERROR:
            return { ...state, loading: false, error: action.payload };
        case GET_TEMPERATURES_SUCCESS:
            return { 
                ...state, 
                ...INITIAL_STATE, 
                temperaturesList: action.payload 
            };
        default:
            return state;
    }
};

export default temperaturesReducer;
