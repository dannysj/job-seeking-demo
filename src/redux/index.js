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
import {NotificationManager} from "react-notifications";
import {logout} from "./userAction";

const reducers = combineReducers({
  user: userReducer,
  major_list: majorListReducer,
  newsStore: newsListReducer,
  mentorListStore: mentorListReducer,
  mentorDetailStore: mentorDetailReducer,
});

const errorReporter = store => next => action => {
  console.log("Error reporting for " + action.type);
  if (action.type.endsWith('REJECTED')){
    NotificationManager.error(action.type, '网络错误');
    return;
  }

  if (action.type.endsWith('FULFILLED') && action.payload.data.code === 44){
    // resign up
    if (store.getState().user) {
      NotificationManager.error("请重新登陆", '登陆过期');
      store.dispatch(logout());
      history.push("/login");
      history.go(0);
    }
    // Send notification.
    return;
  }

  if (action.type.endsWith('FULFILLED') && action.payload.data.code === 1){
    NotificationManager.error(action.type, '数据库错误');
    return;
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
