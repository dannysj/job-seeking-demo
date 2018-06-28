// This file will be used to save log generated from user action.
// There will be two kind of logging. One is the history, and the second is the redux flow 
// The log structure should be defined into one:

// {
//    user_action: (redux action name/ history)    
//    note: (specify by redux to provide more detail for logging)
//    timestamp: (date.now())
// }
//
// Logger will be sent if through API after 20 loggers have been accumulated 
// Another option is each 5 minutes.
import axios from "axios"
import store from "./index";
// Filter log middleware. 

export function logMessage(log){
    
    return ({
        type: "LOG_MESSAGE",
        payload: log
    })
}

export function startLogsInterval(timeout){
    return dispatch => {
        // set timer api 
        let timer = setInterval( 
            ()=> {dispatch( dispatch => {
                        store.getState().logs.forEach( x=> console.log(x.user_action))
                        axios.post("/api/save_logger", {logs: store.getState().logs})
                            .then(
                                res => {
                                    if(res.data.code === 0){
                                        console.log("sending to api")
                                        dispatch({type: "PURGE_ALL_LOGS"}) 
                                    }
                                    else{
                                        console.log("Fail")
                                    }
                                }
                            )
                            .catch(err => {
                                console.log(err)
                            })
                           
                    })
                 }, 
            timeout
            )
        dispatch({type: "START_TIMER", payload: timer})
        
    }
}

