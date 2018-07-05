import {NotificationManager} from "react-notifications";

/**
 * @readonly
 * @enum {number}
 */
export const userStatus = {
  logout: -1,
  pending: 0,
  login: 1,
};
Object.freeze(userStatus);

/**
 * @typedef {Object} User
 * @property {string} access_token
 * @property {string} balance
 * @property {string} cover
 * @property {string} email
 * @property {string} first
 * @property {string} last
 * @property {number} id
 * @property {boolean} isactivated
 * @property {boolean} isadmin
 * @property {boolean} ismentor
 * @property {string[]} major
 * @property {number} num_notifications
 * @property {string} profile_pic
 * @property {string} resume
 * @property {string} wechat
 * @property {Date} register_date
 * @property {userStatus} status
 *
 * @property {null} [dob] not used

 */


/**
 * @type {User}
 * */
const initState = {
  access_token: "",
  balance: "0.00",
  cover: "",
  email: "",
  first: "",
  last: "",
  id: -1,
  isactivated: false,
  isadmin: false,
  ismentor: false,
  major: [],
  num_notifications: 0,
  profile_pic: "/img/sample_profile.jpg",
  resume: "",
  wechat: "",
  register_date: null,
  status: userStatus.logout,

  dob: null, // not used

  }
;

export default (state = initState, action) => {
  switch (action.type) {
    case "SET_USER":
      localStorage.setItem('uid', action.payload.id);
      localStorage.setItem('access_token', action.payload.access_token);
      return {...action.payload, status: userStatus.login};

    case "LOGOUT":
      localStorage.removeItem('uid');
      localStorage.removeItem('access_token');
      return {status: userStatus.logout};


    case "FETCH_USER_PENDING":
      return {status: userStatus.pending};

    case "FETCH_USER_REJECTED":
      NotificationManager.error('无法读取登陆信息', '错误');
      return {status: userStatus.logout};

    case "FETCH_USER_FULFILLED":
      return {...action.payload.data.user, status: userStatus.login};


    case "UPDATE_USER_PENDING":
      return state;

    case "UPDATE_USER_REJECTED":
      if (JSON.parse(action.payload.config.data).attr !== 'last')
        NotificationManager.error('资料更新失败', '错误');
      return state;

    case "UPDATE_USER_FULFILLED":
      if (JSON.parse(action.payload.config.data).attr !== 'last')  // prevent multiple notifications when updating name
        NotificationManager.success('资料更新成功', '完成啦');
      return state;

    case "UPDATE_USER_LOCAL":
      return {...state, [action.payload.attr]: action.payload.val};

    default:
      return state;
  }
}
