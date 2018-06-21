import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunk from 'redux-thunk'
import logger from "redux-logger";
import promise from "redux-promise-middleware";

import userReducer from './userReducer'
import majorListReducer from './majorListReducer'
import mentorListReducer from './mentorListReducer'

const reducers = combineReducers({
  user: userReducer,
  major_list: majorListReducer,
  mentor_list: mentorListReducer,
});

const middleware = applyMiddleware(promise(), thunk, logger);

const store = createStore(reducers, middleware);

export default store