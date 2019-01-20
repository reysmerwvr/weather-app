import {
    GET_PRECIPITATIONS,
    GET_PRECIPITATIONS_SUCCESS,
    GET_PRECIPITATIONS_ERROR
} from '../actions/types';

const INITIAL_STATE = {
    precipitationsList: null,
    error: null,
    success: null,
    loading: false,
};

const precipitationsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_PRECIPITATIONS:
            return { ...state, loading: true, error: null };
        case GET_PRECIPITATIONS_ERROR:
            return { ...state, loading: false, error: action.payload };
        case GET_PRECIPITATIONS_SUCCESS:
            return { 
                ...state, 
                ...INITIAL_STATE, 
                precipitationsList: action.payload 
            };
        default:
            return state;
    }
};

export default precipitationsReducer;
