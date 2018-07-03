import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunk from 'redux-thunk'
import logger from "redux-logger";
import promise from "redux-promise-middleware";

import userReducer from './userReducer'
import majorListReducer from './majorListReducer'
import mentorListReducer from './mentorListReducer'
import newsListReducer from "./newsListReducer";
import mentorDetailReducer from "./mentorDetailReducer";

const reducers = combineReducers({
  user: userReducer,
  major_list: majorListReducer,
  newsStore: newsListReducer,
  mentorListStore: mentorListReducer,
  mentorDetailStore: mentorDetailReducer,
});


let middleware = [promise(),  thunk];

if(process.env.NODE_ENV === 'development'){
  middleware = [...middleware, logger];
}


const store = createStore(reducers, applyMiddleware(...middleware));

export default store;
