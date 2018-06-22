import {NotificationManager} from "react-notifications";

const initState = {
  loading: false,
  news_list: [],
};


export default (state = initState, action) => {
  switch (action.type) {
    case "FETCH_NEWS_LIST_PENDING":
      return {...state, loading:true};

    case "FETCH_NEWS_LIST_REJECTED":
      NotificationManager.error('无法干货信息', '错误');
      return state;

    case "FETCH_NEWS_LIST_FULFILLED":
      return {
        loading: false,
        news_list: action.payload.data.news_list,
      };

    default:
      return state;
  }
}