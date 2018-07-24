import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import './index.less';
import App from './App';
import {Provider} from "react-redux"
import store from "./redux";
import axios from "axios";
import history from "./history"
import {NotificationManager} from "react-notifications";

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  const {protocol, hostname} = window.location;
  const port = 3005;
  axios.defaults.baseURL = protocol + '//' + hostname + ':' + port;
} else if (process.env.REACT_APP_API_HOST) {
  axios.defaults.baseURL = process.env.REACT_APP_API_HOST;
}

axios.interceptors.response.use(
  (response) => {
    if (response.data && response.data.message)
      NotificationManager.success(response.data.message, '成功');
    return response;
  },
  (error) => {
    let message;

    if (error.response) { // The server has a response, but the status code is not 20x
      if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else {
        message = '服务器错误' // Just in case. This should not happen in reality
      }
    } else { // The server has no response
      message = '网络连接错误，无法访问服务器'
    }

    NotificationManager.error(message, '错误');
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter history = {history}>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));
// registerServiceWorker();
