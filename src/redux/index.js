import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunk from 'redux-thunk'
import logger from "redux-logger";
import promise from "redux-promise-middleware";

import userReducer from './userReducer'
import majorListReducer from './majorListReducer'
import mentorListReducer from './mentorListReducer'
import newsListReducer from "./newsListReducer";

const reducers = combineReducers({
  user: userReducer,
  major_list: majorListReducer,
  mentorStore: mentorListReducer,
  newsStore: newsListReducer
});


const middleware = [promise(),  thunk];

if(process.env.NODE_ENV === 'development')
  middleware.concat(logger);

const store = createStore(reducers, applyMiddleware(...middleware));

export default store;
