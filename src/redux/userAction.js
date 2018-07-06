import axios from "axios";
import store from "./index";
import {NotificationManager} from "react-notifications";
import {userStatus} from "./userReducer";

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


export const followUser = (followee_uid) => {
  if (store.getState().user.status === userStatus.login)
    return {
      type: "FOLLOW_MENTOR",
      payload: axios.post(
        '/api/follow_user',
        {followee_uid},
        {headers: {"access_token": store.getState().user.access_token}}
      )
    };
  else
    NotificationManager.error('请先登录', '错误');
};

export const unfollowUser = (followee_uid) => {
  if (store.getState().user.status === userStatus.login)
    return {
      type: "UNFOLLOW_MENTOR",
      payload: axios.post(
        '/api/unfollow_user',
        {followee_uid},
        {headers: {"access_token": store.getState().user.access_token}}
      )
    };
  else
    NotificationManager.error('请先登录', '错误');
};