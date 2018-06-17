import {applyMiddleware, createStore, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import logger from "redux-logger";
import promise from "redux-promise-middleware";

import userReducer from "./userReducer"

const reducers = combineReducers({
  user: userReducer,
});

const middleware = [promise(), thunk, logger];

const initState = {
  user: {
    first: "",
    last: ""
  }
};

const store = createStore(
  reducers,
  initState,
  applyMiddleware(...middleware),
);

export default store