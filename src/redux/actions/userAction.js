import axios from "axios";

export function fetchUser(uid) {
  return {
    type: "FETCH_USER",
    payload: axios.post(process.env.REACT_APP_API_HOST + '/api/get_user_info', {uid: uid})
  }
}

export function updateUser(user){
  return{
    type: "UPDATE_USER",
    payload: user
  }
}