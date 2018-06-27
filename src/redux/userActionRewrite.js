import axios from "axios";
import store from "./index";

export function verifyUser(user){
    return dispatch => axios.post('/api/verify_user', user)
                            .then(res => {
                                if (res.data.code === 0){
                                    dispatch(loginSuccess())
                                    dispatch(setUser(res.data.user))
                                }
                                else{
                                    dispatch(loginFailure())
                                }
                            })
}

export function logout(){

    dispatch(loginDefault())

    return{
        type:"LOGOUT"
    }
}

export function setUser(user){

    return( 
        {
            type: "SET_USER",
            payload: user
        }
    )
}

export function updateUser(attr, val) {
    return dispatch => {
        const uid = store.getState().user.id;
        axios.post('/api/update_user', {uid, attr, val})
             .then(
                res => {
                    dispatch()
                }, 
                err=>{});
             
    }
    
    
    const uid = store.getState().user.id;
}

export function loginFailure(){
    return(
        {
            type: "LOGIN_FAILURE"
        }
    )
}

export function loginSuccess(){
    return(
        {
            type: "LOGIN_SUCCESS"
        }
    )
}

export function loginDefault(){
    return (
        {
            type: "LOGIN_DEFAULT"
        }
    )
}