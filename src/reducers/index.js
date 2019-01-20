import { combineReducers } from 'redux';
import authReducer from './auth_reducer';
import forecastReducer from './forecast_reducer';
import temperaturesReducer from './temperatures_reducer';
import precipitationsReducer from './precipitations_reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    forecasts: forecastReducer,
    temperatures: temperaturesReducer,
    precipitations: precipitationsReducer,
});

export default rootReducer;