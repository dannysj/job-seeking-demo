import axios from "axios";
import store from "./index";

export function fetchUser(access_token) {
  return {
    type: "FETCH_USER",
    payload: axios.post('/api/get_user_info', {},{headers:{access_token: access_token} })
  }
}

export function setUser(user) {
  return {
    type: "SET_USER",
    payload: user
  }
}

export function updateUser(attr, val, {local = false} = {}) {
  const uid = store.getState().user.id;
  if (local) {
    return {
      type: "UPDATE_USER_LOCAL",
      payload: {attr, val}
    }
  } else {
    return {
      type: "UPDATE_USER",
      payload: axios.post('/api/update_user', {uid, attr, val}, {headers:{access_token: access_token}})
    }
  }
}

export function logout() {
  return {
    type: "LOGOUT"
  }
}
