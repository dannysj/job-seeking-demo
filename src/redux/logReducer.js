import {List} from "immutable"
let initState = List([])
let initTimer = null;

export function logs(state = initState, action){
    switch (action.type){
        case "LOG_MESSAGE":
            return state.push(action.payload)
        case "PURGE_ALL_LOGS":
            return initState
        default:
            return state
    }
}

export function timer(state = initTimer, action) {
    switch (action.type){
        case "START_TIMER":
            return action.payload
        default:
            return state
    }
}
