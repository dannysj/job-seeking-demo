import store from "./redux";

export const getAuthHeader = () => {
  const user = store.getState().user;
  // When access_token is null, the request will not be sent, see index.js
  const access_token =  user ? user.access_token : null;
  return {headers: {access_token}};
};