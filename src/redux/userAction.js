import axios from "axios";
import store from "./index";

export function fetchUser(access_token) {
  return {
    type: "FETCH_USER",
    payload: axios.post('/api/get_user_info', {access_token: access_token})
  }
}

export function setUser(user){
  return{
    type: "SET_USER",
    payload: user
  }
}

export function updateUser(attr, val){
  const uid = store.getState().user.id;
  return {
    type: "UPDATE_USER",
    payload: axios.post('/api/update_user', {uid, attr, val})
  }
}

export function logout(){
  return{
    type: "LOGOUT"
  }
}
