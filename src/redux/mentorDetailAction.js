import axios from "axios";
import store from "./index";

export function fetchMentorDetail(mid) {
  return {
    type: "FETCH_MENTOR_DETAIL",
    payload: axios.post('/api/get_mentor_detail', {mid})
  };
}


export function createMentorComment(mid, text){
  const uid = store.getState().user.id;
  const access_token = store.getState().user.access_token;
  console.log(access_token)
  return{
    type: "CREATE_MENTOR_COMMENT",
    payload: axios.post('/api/create_mentor_comment', {mid, text}, {headers: {access_token}})
  }
}



export function createMentorReply(id, reply){
  return{
    type: "CREATE_MENTOR_REPLY",
    payload:axios.post('/api/create_mentor_reply', {id, reply}) // TODO: access_token
  }
}