import axios from "axios";
import store from "./index";
import {NotificationManager} from "react-notifications";

export const fetchUser = () => {
  const user = store.getState().user;
  return {
    type: "FETCH_USER",
    payload: axios.post('/api/get_user_info', {}, {headers: {access_token:user.access_token}})
  }
};

export const setUser = (user) => {
  return {
    type: "SET_USER",
    payload: user
  }
};

export const updateAccessToken = (access_token) =>{
  return {
    type: "UPDATE_ACCESS_TOKEN",
    payload: access_token
  }
};


export const updateUser = (attr, val, {local = false} = {}) => dispatch => {
  const user =store.getState().user;
  dispatch({
    type: "UPDATE_USER_LOCAL",
    payload: {attr, val}
  });
  if (!local)
    dispatch({
      type: "UPDATE_USER",
      payload: axios.post('/api/update_user', {attr, val}, {headers: {access_token:user.access_token}})
    });
};

export function changeUserPassword(new_password, user) {
  return {
    type: "CHANGE_PASSWORD",
    payload: axios.post('/api/change_password', {email: user.email, password: new_password},
        {headers: {access_token:user.access_token}}),
    password: new_password
  }
}

export function logout() {
  return {
    type: "LOGOUT"
  }
}


export const followUser = (followee_uid) => {
  const user = store.getState().user;
  if (user)
    return {
      type: "FOLLOW_MENTOR",
      payload: axios.post('/api/follow_user', {followee_uid}, {headers: {access_token:user.access_token}})
    };
  else
    NotificationManager.error('请先登录', '错误');
};

export const unfollowUser = (followee_uid) => {
  const user = store.getState().user;
  if (user)
    return {
      type: "UNFOLLOW_MENTOR",
      payload: axios.post('/api/unfollow_user', {followee_uid}, {headers: {access_token:user.access_token}})
    };
  else
    NotificationManager.error('请先登录', '错误');
};