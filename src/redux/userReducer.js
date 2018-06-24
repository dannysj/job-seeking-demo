import {NotificationManager} from "react-notifications";

export const userStatus = {
  logout: -1,
  pending: 0,
  login: 1,
};
Object.freeze(userStatus);

/**
 * @type {{
 *  balance: string,
 *  cover: string,
 *  dob: Date,
 *  email: string,
 *  first: string,
 *  last: string,
 *  id: number,
 *  isactivated: boolean,
 *  isadmin: boolean,
 *  ismentor: boolean,
 *  major: string[],
 *  num_notifications: number,
 *  profile_pic: string,
 *  register_date: Date,
 *  resume: string,
 *  wechat: string,
 *  status: number
 *  }}
 */
const initState = {
  balance: "0.00",
  cover: "",
  dob: null, // not used
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
  register_date: null, // not used
  resume: "",
  wechat: "",
  status: userStatus.logout,
};


export default (state = initState, action) => {
  switch (action.type) {
    case "SET_USER":
      localStorage.setItem('uid', action.payload.id);
      return {...action.payload, status: userStatus.login};

    case "LOGOUT":
      localStorage.removeItem('uid');
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
      NotificationManager.error('资料更新失败', '错误');
      return state;

    case "UPDATE_USER_FULFILLED":
      const {attr, val} = JSON.parse(action.payload.config.data);
      if(attr != 'num_notifications') {
        NotificationManager.success('资料更新成功', '完成啦');
      }
      return {...state, [attr]: val};


    default:
      return state;
  }
}
