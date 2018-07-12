import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import './index.less';
import App from './App';
// Redux
import {Provider} from "react-redux"
import store from "./redux";
// axios setting
import axios from "axios";

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  const {protocol, hostname} = window.location;
  const port = 3005;
  axios.defaults.baseURL = protocol + '//' + hostname + ':' + port;
}


const user = store.getState().user;
if (user && user.access_token)
  axios.defaults.headers.common['access_token'] = user.access_token;

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));
// registerServiceWorker();
