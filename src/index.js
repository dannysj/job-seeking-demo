import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import './index.less';
import App from './App';
import {Provider} from "react-redux"
import store from "./redux";
import axios from "axios";

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  const {protocol, hostname} = window.location;
  const port = 3005;
  axios.defaults.baseURL = protocol + '//' + hostname + ':' + port;
}


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));
// registerServiceWorker();
