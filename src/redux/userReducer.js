import {NotificationManager} from "react-notifications";
import axios from "axios/index";

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
      break;

    case "FOLLOW_MENTOR_PENDING":
      return state;

    case "FOLLOW_MENTOR_REJECTED":
      NotificationManager.error('关注失败', '错误');
      return state;

    case "FOLLOW_MENTOR_FULFILLED":
      if (action.payload.data.code === 0) {
        NotificationManager.success('关注成功', '成功');
        const uid = JSON.parse(action.payload.config.data).followee_uid;
        return {...state, followee: [...state.followee, uid]};
      } else {
        NotificationManager.error('关注失败', '错误');
        return state;
      }

    case "UNOLLOW_MENTOR_PENDING":
      return state;

    case "UNFOLLOW_MENTOR_REJECTED":
      NotificationManager.error('取关失败', '错误');
      return state;

    case "UNFOLLOW_MENTOR_FULFILLED":
      if (action.payload.data.code === 0) {
        NotificationManager.success('取关成功', '成功');
        const uid = JSON.parse(action.payload.config.data).followee_uid;
        const followee = state.followee.filter(e => e !== uid);
        return {...state, followee};
      } else {
        NotificationManager.error('取关失败', '错误');
        return state;
      }

    case "CHANGE_PASSWORD_PENDING":
      return state;

    case "CHANGE_PASSWORD_REJECTED":
      NotificationManager.error('由于服务器原因，资料更新失败', '错误');
      return state;

    case "CHANGE_PASSWORD_FULFILLED":
      if (action.payload.data.code === 0) {
        NotificationManager.success('资料更新成功', '完成啦');
      }
      if (action.payload.data.code === 1) {
        NotificationManager.error('后台无法更新资料', '错误');
      }
      return state;

    default:
      return state;
  }

  localStorage.setItem('user', JSON.stringify(state));
  return state;
}
