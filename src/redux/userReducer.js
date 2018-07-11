import {NotificationManager} from "react-notifications";

export default (state = JSON.parse(localStorage.getItem('user')), action) => {
  switch (action.type) {
    case "SET_USER":
      state = action.payload;
      break;

    case "LOGOUT":
      localStorage.removeItem('user');
      state = null;
      break;


    case "FETCH_USER_PENDING":
      state = {pending: true};
      break;

    case "FETCH_USER_FULFILLED":
      state = {...action.payload.data.user};
      break;


    case "UPDATE_USER_FULFILLED":
      const data = JSON.parse(action.payload.config.data);
      if (data.attr !== 'last')  // prevent multiple notifications when updating name
        NotificationManager.success('资料更新成功', '完成啦');
      state = {...state, [data.attr]: data.val};
      break;


    case "UPDATE_USER_LOCAL":
      state = {...state, [action.payload.attr]: action.payload.val};
  }

  localStorage.setItem('user', JSON.stringify(state));
  return state;
}
