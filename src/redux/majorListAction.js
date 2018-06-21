import axios from "axios";
import store from "./index";

export function fetchMajorList() {
  if (store.getState().major_list.length === 0)
    return {
      type: "FETCH_MAJOR_LIST",
      payload: axios.post('/api/get_major_list')
    };
  else
    return {
      type: "USE_CACHED_MAJOR_LIST",
    }
}