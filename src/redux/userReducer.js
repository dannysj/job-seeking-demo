import {NotificationManager} from "react-notifications";

export default (state = {}, action) => {
  let user = null;
  const {type, payload} = action;

  switch (type) {
    case "SET_USER":
      user = payload;
      break;

    case "UPDATE_USER":
      user = {...state, [payload.prop]: payload.val};
      break;

    case "FETCH_USER_FULFILLED":
      user = payload.data.user;
      break;

    case "LOGOUT":
      localStorage.removeItem('access_token');
      return null;

    case "FETCH_USER_REJECTED":
      NotificationManager.error('无法读取登陆信息', '错误');
      return null;

    case "FETCH_USER_PENDING":
      return null;

    default:
      return null;
  }

  localStorage.setItem('access_token', user.access_token);
  return user;
}