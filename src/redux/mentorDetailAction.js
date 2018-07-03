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
  return{
    type: "CREATE_MENTOR_COMMENT",
    payload:axios.post('/api/create_mentor_comment', {mid, text, uid})
  }
}



export function createMentorReply(id, reply){
  return{
    type: "CREATE_MENTOR_REPLY",
    payload:axios.post('/api/create_mentor_reply', {id, reply})
  }
}

export function createCommentLike(id){
  const uid = store.getState().user.id;
  return{
    type: "CREATE_COMMENT_LIKE",
    payload:axios.post('/api/create_comment_like', {comment_id: id, uid})
  }
}