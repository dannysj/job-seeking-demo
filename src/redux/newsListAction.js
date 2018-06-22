import axios from "axios";
import * as config from "./config";

export function fetchNewsList(batch_num = 0) {
  return {
    type: "FETCH_NEWS_LIST",
    payload: axios.post('/api/get_news_list', {batch_size: config.news_batch_size, batch_num})
  };
}