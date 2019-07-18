import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import ReduxThunk from 'redux-thunk';
import axios from 'axios';

import { handleError, defaultErrorMessage } from './helpers/general';
import reducers from './reducers';
import history from './helpers/history';
import Login from './containers/Login';
import Dashboard from './containers/Dashboard';
import {
  AUTH_USER,
  AUTH_USER_ERROR,
  AUTH_USER_SUCCESS,
} from './actions/types';
import './App.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(ReduxThunk)));
let errorMessage = defaultErrorMessage;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { isAuthenticated: false };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if(token) {
      const self = this;
      store.dispatch({ type: AUTH_USER });
      axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/auth-user`,
        headers: {
          'Content-Type': process.env.REACT_APP_CONTENT_TYPE_HEADER,
          Accept: process.env.REACT_APP_ACCEPT_HEADER,
          Authorization: token
        }
      }).then((response) => {
          const userResponse = response.data;
          store.dispatch({ type: AUTH_USER_SUCCESS, payload: userResponse });
          self.setState({ isAuthenticated: true });
          history.push('/dashboard');
      }).catch((error) => {
          handleError(error);
          self.setState({ isAuthenticated: false });
          if (error !== undefined) {
            const errorResponse = error.response.data;
            if (errorResponse) {
                errorMessage = errorResponse.message
            }
          }
          store.dispatch({ type: AUTH_USER_ERROR, payload: errorMessage });
      });
    }
  }

  render() {
    const { isAuthenticated } = this.state;
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute
              exact 
              path="/dashboard" 
              component={Dashboard}
              isAuthenticated={isAuthenticated} 
            />
            <PrivateRoute
              exact 
              path="/temperatures" 
              component={Dashboard}
              isAuthenticated={isAuthenticated} 
            />
            <PrivateRoute
              exact 
              path="/precipitations" 
              component={Dashboard}
              isAuthenticated={isAuthenticated} 
            />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

function PrivateRoute({ component: Component, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        (isAuthenticated || localStorage.getItem('token')) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export default App;
