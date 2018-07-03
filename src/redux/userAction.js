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
  return dispatch => {
    dispatch({
      type: "UPDATE_USER_LOCAL",
      payload: {attr, val}
    });
    if (!local)
      dispatch({
        type: "UPDATE_USER",
        payload: axios.post('/api/update_user', {uid, attr, val})
      });
  }
}

export function logout() {
  return {
    type: "LOGOUT"
  }
}