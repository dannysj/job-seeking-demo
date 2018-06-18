import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Redux
import {Provider} from "react-redux"
import store from "./redux";

// axios setting
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_HOST;

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
