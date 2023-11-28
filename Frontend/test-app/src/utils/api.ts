import axios, { Axios, AxiosResponse } from "axios";

import { ChatMessagesType } from "../components";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

type userData = AxiosResponse<{
  status: "success" | "failed";
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
}>;

export type userStatusData = AxiosResponse<{
  status: "success" | "fail";
  online: boolean;
}>;

export const getUserDetails = async (userName: string): Promise<userData> => {
  try {
    const res = await api.get(`/user/${userName}`);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const setUserStatusToOnline = async (
  user: string
): Promise<userStatusData> => {
  try {
    const res = await api.patch(`/user/status/${user}`);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createUser = async (userName: string): Promise<userData> => {
  try {
    const res = await api.post("/user/signup", {
      user_id: userName,
      user_name: userName,
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default api;
