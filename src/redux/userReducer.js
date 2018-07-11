import {NotificationManager} from "react-notifications";
import axios from "axios/index";

export default (state = JSON.parse(localStorage.getItem('user')), action) => {
  switch (action.type) {
    case "LOGOUT":
      delete axios.defaults.headers.common['access_token'];
      localStorage.removeItem('user');
      return null;


    case "SET_USER":
      axios.defaults.headers.common['access_token'] = action.payload.access_token;
      state = action.payload;
      break;



    case "FETCH_USER_PENDING":
      state = {...state, pending: true};
      break;

    case "FETCH_USER_FULFILLED":
      axios.defaults.headers.common['access_token'] = action.payload.access_token;
      state = action.payload.data.user;
      break;


    case "UPDATE_USER_FULFILLED":
      const data = JSON.parse(action.payload.config.data);
      if (data.attr !== 'last')  // prevent multiple notifications when updating name
        NotificationManager.success('资料更新成功', '完成啦');
      state = {...state, [data.attr]: data.val};
      break;


    case "UPDATE_USER_LOCAL":
      state = {...state, [action.payload.attr]: action.payload.val};
    case "CHANGE_PASSWORD_PENDING":
      return state;

    case "CHANGE_PASSWORD_REJECTED":
      NotificationManager.error('由于服务器原因，资料更新失败', '错误');
      return state;

    case "CHANGE_PASSWORD_FULFILLED":
      console.log("CHANGE PASSWORD");
      console.log(action.payload);
      if (action.payload.data.code === 0) {
          NotificationManager.success('资料更新成功', '完成啦');
      }
      if (action.payload.data.code === 1){
          NotificationManager.error('后台无法更新资料', '错误');
      }
      return state;


    default:
      return state;
  }

  localStorage.setItem('user', JSON.stringify(state));
  return state;
}
