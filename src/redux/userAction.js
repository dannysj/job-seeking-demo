import axios from "axios";
import store from "./index";

export const fetchUser = () => {
  return {
    type: "FETCH_USER",
    payload: axios.post('/api/get_user_info')
  }
};

export const setUser = (user) => {
  return {
    type: "SET_USER",
    payload: user
  }
};

export function updateUser(attr, val, {local = false} = {}) {
  return dispatch => {
    dispatch({
      type: "UPDATE_USER_LOCAL",
      payload: {attr, val}
    });
    if (!local)
      dispatch({
        type: "UPDATE_USER",
        payload: axios.post('/api/update_user', {attr, val})
      });
  }
}

export function changeUserPassword(new_password, user) {
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
