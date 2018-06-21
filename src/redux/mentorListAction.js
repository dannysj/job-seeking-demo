import axios from "axios";
import store from "./index";

export function fetchMentorList() {
  if (store.getState().mentor_list.mentors.length === 0)
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