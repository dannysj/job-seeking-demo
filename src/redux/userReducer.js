import {NotificationManager} from "react-notifications";

export const userStatus = {
  logout: -1,
  pending: 0,
  login: 1,
};
Object.freeze(userStatus);

const initState = {
  balance: "0.00",
  cover: null,
  dob: null,
  email: null,
  first: null,
  id: -1,
  isactivated: false,
  isadmin: false,
  ismentor: false,
  last: null,
  major: [],
  num_notifications: 0,
  password: null,
  profile_pic: "/img/sample_profile.jpg",
  register_date: null,
  resume: null,
  wechat: null,
  status: userStatus.logout,
};


export default (state = initState, action) => {
  const {type, payload} = action;

  switch (type) {
    case "SET_USER":
      localStorage.setItem('uid', payload.id);
      return {...payload, status: userStatus.login};

    case "FETCH_USER_FULFILLED":
      return {...payload.data.user, status: userStatus.login};

    case "UPDATE_USER":
      return {...state, [payload.prop]: payload.val};

    case "LOGOUT":
      localStorage.removeItem('uid');
      return {status: userStatus.logout};

    case "FETCH_USER_REJECTED":
      NotificationManager.error('无法读取登陆信息', '错误');
      return {status: userStatus.logout};

    case "FETCH_USER_PENDING":
      return {status: userStatus.pending};

    default:
      return initState;
  }
}