import axios from "axios";
import store from "./index";

/*
export function fetchMajorList2(){
  return dispatch =>{
    dispatch(requestMajorList);
    return axios.post('/api/get_major_list')
                .then(res=>1, err=>2)
                // dispatch an action creator and its pure reducer
                .then(list => dispatch(receiveMajorList("")))
  }
}
*/

export function fetchMajorList() {
  if (store.getState().major_list.length === 0)
    return {
      type: "FETCH_MAJOR_LIST",
      payload: axios.post('/api/get_major_list')
    };
  else
    return {
      type: "USE_CACHED_MAJOR_LIST",
      payload: new Promise(f=>f())
    }
}