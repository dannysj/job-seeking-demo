import axios from "axios";
import store from "./index";

export function fetchUser(uid) {
  return {
    type: "FETCH_USER",
    payload: axios.post('/api/get_user_info', {uid})
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
      payload: axios.post('/api/update_user', {uid, attr, val})
    }
  }
}

export function changeUserPassword(new_password, user) {
  console.log(new_password)
    return {
      type: "CHANGE_PASSWORD",
      payload: axios.post('/api/change_password', {email: user.email, password: new_password, uid: user.id}),
      password: new_password
    }
}

export function logout() {
  return {
    type: "LOGOUT"
  }
}