import { combineReducers } from 'redux';
import authReducer from './auth_reducer';
import forecastReducer from './forecast_reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    forecasts: forecastReducer
});

export default rootReducer;