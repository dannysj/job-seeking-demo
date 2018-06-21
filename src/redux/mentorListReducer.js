import {NotificationManager} from "react-notifications";

const initState = {
  loading:false,
  mentors: [],
  majors: [],
  colleges:[]
};


export default (state = initState, action) => {
  switch (action.type) {
    case "FETCH_MENTOR_LIST_PENDING":
      return {...state, loading:true};

    case "FETCH_MENTOR_LIST_REJECTED":
      NotificationManager.error('无法导师信息', '错误');
      return state;

    case "FETCH_MENTOR_LIST_FULFILLED":
      const list = action.payload.data.list;
      return {
        loading: false,
        mentors: list,
        majors: Array.from(new Set([].concat.apply([], list.map(e => e.major)))),
        colleges: Array.from(new Set(list.map(e => e.college_name))),
      };


    default:
      return state;
  }
}