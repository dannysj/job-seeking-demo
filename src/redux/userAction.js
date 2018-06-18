import axios from "axios";

export function fetchUser(uid) {
  return {
    type: "FETCH_USER",
    payload: axios.post('/api/get_user_info', {uid: uid})
  }
}

export function setUser(user){
  return{
    type: "SET_USER",
    payload: user
  }
}

export function updateUser(prop, val){
  return{
    type: "UPDATE_USER",
    payload: {prop, val}
  }
}

export function logout(){
  return{
    type: "LOGOUT"
  }
}