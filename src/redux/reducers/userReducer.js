import {NotificationManager} from "react-notifications";

export default (state, action) => {
  let user = null;

  switch (action.type) {
    case "FETCH_USER_REJECTED":
      NotificationManager.error('无法读取登陆信息', '错误');
      return;

    case "UPDATE_USER":
      user = action.payload;
      break;

    case "FETCH_USER_FULFILLED":
      user = action.payload.data.user;
      break;

    case "FETCH_USER_PENDING":
      break;
  }

  localStorage.setItem('uid', user.id);
  return user;
}