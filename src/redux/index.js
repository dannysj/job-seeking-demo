import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunk from 'redux-thunk'
import {createLogger} from "redux-logger";
import promise from "redux-promise-middleware";
import userReducer from './userReducer'
import majorListReducer from './majorListReducer'
import mentorListReducer from './mentorListReducer'
import newsListReducer from "./newsListReducer";
import {logs, timer} from "./logReducer";
import {logMessage, startLogsInterval} from "./logAction"

const reducers = combineReducers({
  user: userReducer,
  major_list: majorListReducer,
  mentorStore: mentorListReducer,
  newsStore: newsListReducer,
  logs,
  timer
});

function filterOutLogs(storeState){
  let state = {}
  for (const [key, value] of Object.entries(storeState)){
    let unwantedKeys = ["logs","timer"]
    if (!unwantedKeys.includes(key)){
      state[key] = value
    }
  }
  return state
}

const beconMiddleWare = store => next => action =>{
  // This middleware is constructed for becon system. 
  // This middleware collects the information provided by each redux action and store them
  // Each action can provide extra information to control the behavior of this middleware
  // Assign "doNotLog" to true in one action can disable the information to be logged.
  // Assign information as "logNote" will provide log more customized information for each action
  // This implementation might have concurrency issue. Loggers can be pushed at any time by any two objects
  switch (action.type) {
    case "LOG_MESSAGE":
      return next(action)
    default:

      if (action.doNotLog !== undefined && action.doNotLog === true){
        return next(action)
      }

      let log = {user_action:"", prev_state:"", next_state:"", timestamp:"", note:""}
      log.user_action = action.type.toLowerCase()

      if (action.logNote !== undefined){
        log.note = action.logNote
      } 
      //log.prev_state = filterOutLogs(store.getState())
      let result = next(action)
      //log.next_state = filterOutLogs(store.getState())
      log.timestamp = Date.now()
      store.dispatch(logMessage(log))
      return result
  }
}

let middleware = [promise(),  thunk];

if(process.env.NODE_ENV === 'development'){
  //middleware = [...middleware, logger];
  middleware = [...middleware, lbeconMiddleWare];
} 

const store = createStore(reducers, applyMiddleware(...middleware));
store.dispatch(startLogsInterval(15000))

export default store;
