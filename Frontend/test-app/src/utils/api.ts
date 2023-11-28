import axios, { AxiosResponse } from "axios";

import { ChatMessagesType } from "../components";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});
const userName = Cookies.get("userName");

type userData = {
  status: "success" | "fail";
  data: {
    _id: string;
    user_id: string;
    user_name: string;
    online: boolean;
    messages: {
      user_id: string;
      chats: ChatMessagesType[];
    }[];
  };
};

type userStatusData = AxiosResponse<{
  status: "success" | "fail";
  online: boolean;
}>;

export type userDataAxiosResponse = AxiosResponse<userData>;

export const getUserDetails = async (): Promise<userDataAxiosResponse> => {
  try {
    const res = await api.get(`/user/${userName}`);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const setUserStatusToOnline = async (): Promise<userStatusData> => {
  try {
    const res = await api.patch(`/user/status/${userName}`);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default api;
