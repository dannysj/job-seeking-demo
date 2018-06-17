import {applyMiddleware, createStore as createReduxStore} from 'redux'
import thunk from 'redux-thunk'
import logger from "redux-logger";
import promise from "redux-promise-middleware";
import reducers from "./reducers"

const middleware = [promise(), thunk, logger];
const initState = {
  user: {
    first: "",
    last: ""
  }
};

const store = createReduxStore(
  reducers,
  initState,
  applyMiddleware(...middleware),
);

export default store