import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunk from 'redux-thunk'
import logger from "redux-logger";
import promise from "redux-promise-middleware";
import history from "../history"

import userReducer from './userReducer'
import majorListReducer from './majorListReducer'
import mentorListReducer from './mentorListReducer'
import newsListReducer from "./newsListReducer";
import mentorDetailReducer from "./mentorDetailReducer";
import {logout} from "./userAction";

const reducers = combineReducers({
  user: userReducer,
  major_list: majorListReducer,
  newsStore: newsListReducer,
  mentorListStore: mentorListReducer,
  mentorDetailStore: mentorDetailReducer,
});

const errorReporter = store => next => action => {
  if (!action.type.endsWith('REJECTED')) return next(action);
  if (!action.payload.response) return next(action); // The server should return a response

  const data = action.payload.response.data;
  if (data && data.code === 44 && store.getState().user) {
    // resign up
    store.dispatch(logout());
    history.push("/login");
    history.go(0);
    // Send notification.
  }

  return next(action);
};

let middleware = [promise(), thunk, errorReporter];

if (process.env.NODE_ENV === 'development') {
  middleware = [...middleware, logger];
}



const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(...middleware)
);


export default store;
