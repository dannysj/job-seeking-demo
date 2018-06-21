import axios from "axios";
import store from "./index";
import * as config from "./config";

export function fetchMentorList() {
  console.log(new Date() - store.getState().mentor_list.last_fetched );
  if (new Date() - store.getState().mentor_list.last_fetched > config.expire_time)
    return {
      type: "FETCH_MENTOR_LIST",
      payload: axios.post('/api/get_mentor_list')
    };
  else
    return {
      type: "USE_CACHED_MENTOR_LIST",
      payload: new Promise((f)=>f())
    }
}