import {NotificationManager} from "react-notifications";
import axios from "axios/index";

export default (state = JSON.parse(localStorage.getItem('user')), action) => {
  switch (action.type) {
    case "LOGOUT":
      state = null;
      break;

    case "UPDATE_ACCESS_TOKEN":
      state = {...state, access_token: action.payload};
      break;

    case "SET_USER":
      state = action.payload;
      break;

    case "FETCH_USER_PENDING":
      state = {...state, pending: true};
      break;

    case "FETCH_USER_FULFILLED":
      state = action.payload.data.user;
      break;


    case "FETCH_USER_REJECTED":
      state = null;
      break;


    case "UPDATE_USER_FULFILLED":
      const data = JSON.parse(action.payload.config.data);
      if (data.attr !== 'last')  // prevent multiple notifications when updating name
        NotificationManager.success('资料更新成功', '完成啦');
      state = {...state, [data.attr]: data.val};
      break;


    case "UPDATE_USER_LOCAL":
      state = {...state, [action.payload.attr]: action.payload.val};
      break;


    case "FOLLOW_MENTOR_FULFILLED": {
      NotificationManager.success('关注成功', '成功');
      const uid = JSON.parse(action.payload.config.data).followee_uid;
      state = {...state, followee: [...state.followee, uid]};
      break;
    }


    case "UNFOLLOW_MENTOR_FULFILLED": {
      NotificationManager.success('取关成功', '成功');
      const uid = JSON.parse(action.payload.config.data).followee_uid;
      const followee = state.followee.filter(e => e !== uid);
      state = {...state, followee};
      break;
    }

    case "CHANGE_PASSWORD_FULFILLED":
      NotificationManager.success('资料更新成功', '完成啦');
      break;
  }

  if (state) {
    localStorage.setItem('user', JSON.stringify(state));
  } else {
    localStorage.removeItem('user');
  }

  return state;
}
