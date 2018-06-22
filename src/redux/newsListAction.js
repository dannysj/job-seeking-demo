import axios from "axios";
import * as config from "./config";
import store from "./index";

export function fetchNewsList(batch_num = 0) {
  if (new Date() - store.getState().newsStore.last_fetched[batch_num] > config.expire_time)
    return {
      type: "FETCH_NEWS_LIST",
      payload: axios.post('/api/get_news_list', {batch_size: config.news_batch_size, batch_num})
    };
  else
    return {
      type: "USE_CACHED_NEWS_LIST",
      payload: new Promise(f=>f())
    }
}