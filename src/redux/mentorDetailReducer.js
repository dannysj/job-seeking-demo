import {NotificationManager} from "react-notifications";

const initState = {};


export default (state = initState, action) => {
  switch (action.type) {
    case "FETCH_MENTOR_DETAIL_REJECTED":
      NotificationManager.error('无法读取导师信息', '错误');
      return state;

    case "FETCH_MENTOR_DETAIL_FULFILLED":
      const mentor = action.payload.data.mentor;
      return {...state, [mentor.mid]: mentor};


      // TODO: Error message for CREATE_MENTOR_COMMENT and CREATE_MENTOR_REPLY
    default:
      return state;
  }
}
