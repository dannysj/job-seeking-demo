import {NotificationManager} from "react-notifications";

const initState = {
  loading: false,
  news_list: [],
  last_fetched:[new Date(0)]
};


export default (state = initState, action) => {
  switch (action.type) {
    case "FETCH_NEWS_LIST_PENDING":
      return {...state, loading:true};

    case "FETCH_NEWS_LIST_REJECTED":
      NotificationManager.error('无法干货信息', '错误');
      return state;

    case "FETCH_NEWS_LIST_FULFILLED":
      const batch_num = JSON.parse(action.payload.config.data).batch_num;
      const last_fetched = state.last_fetched;
      last_fetched[batch_num] = new Date();
      return {
        last_fetched,
        loading: false,
        news_list: action.payload.data.news_list,
      };

    default:
      return state;
  }
}