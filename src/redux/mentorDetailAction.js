import axios from "axios";
import store from "./index";

export function fetchMentorDetail(mid) {
  return {
    type: "FETCH_MENTOR_DETAIL",
    payload: axios.post('/api/get_mentor_detail', {mid})
  };
}


export function createMentorComment(mid, text){
  const access_token = store.getState().user.access_token;
  return{
    type: "CREATE_MENTOR_COMMENT",
    payload: axios.post('/api/create_mentor_comment', {mid, text}, {headers: {access_token}})
  }
}



export function createMentorReply(comment_id, reply){
  const access_token = store.getState().user.access_token;
  return{
    type: "CREATE_MENTOR_REPLY",
    payload:axios.post('/api/create_mentor_reply', {comment_id, reply}, {headers: {access_token}})
  }
}

export function createCommentLike(id){
  const uid = store.getState().user.id;
  return{
    type: "CREATE_COMMENT_LIKE",
    payload:axios.post('/api/create_comment_like', {comment_id: id, uid})
  }
}