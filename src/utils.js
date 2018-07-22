import store from "./redux";
import {NotificationManager} from "react-notifications";

export const getAuthHeader = () => {
  if (!store.getState().user) {
    NotificationManager.error('请先登录', '错误');
    return {};
  }

  return {headers: {access_token: store.getState().user.access_token}};
};