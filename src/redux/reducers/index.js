import {combineReducers} from "redux"

import userReducer from "./userReducer"
import newsReducer from "./newsReducer";

const reducers = combineReducers({
  user: userReducer,
  news: newsReducer,
});

export default reducers;
