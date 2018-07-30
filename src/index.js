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

axios.interceptors.request.use(
  (config) => {
    if (config.headers.access_token === null){
      NotificationManager.error('请先登录', '错误');
      throw new axios.Cancel('请先登录');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  });

axios.interceptors.response.use(
  (response) => {
    if (response.data && response.data.message)
      NotificationManager.success(response.data.message, '成功');
    return response;
  },
  (error) => {
    if (!(error instanceof axios.Cancel)) // See axios.interceptors.request
      NotificationManager.error(getMessagefromError(error), '错误');

    return Promise.reject(error);
  }
);

const getMessagefromError = (error) => {
  if (!error.response) // The server has no response
    return '网络连接错误，无法访问服务器';

  if (error.response.data && error.response.data.message)  // The server has a response, but the status code is not 20x
    return error.response.data.message;

  return '未知服务器错误'
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter history = {history}>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));
// registerServiceWorker();
