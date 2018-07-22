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
    if (error.message === 'Network Error')
      NotificationManager.error('无法连接到服务器', '错误');
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
