import axios, { AxiosResponse } from "axios";

import { ChatMessagesType } from "../components";
import { ChatUsersType } from "../components/Chat/ChatUsers";
import Cookies from "js-cookie";
import { Dispatch } from "react";

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
      unread: number;
    }[];
  };
}>;

export type userStatusData = AxiosResponse<{
  status: "success" | "fail";
  online: boolean;
}>;

export type userMessages = AxiosResponse<{
  status: string;
  messages: {
    user_id: string;
    chats: ChatMessagesType[];
  };
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

export const sendMessage = async (
  /* remove undefined types  */
  user: string | undefined,
  currentChatWith: string | undefined,
  message: string
): Promise<userMessages> => {
  try {
    const res = await api.post(`/chat/${user}`, {
      chatUserId: currentChatWith,
      chatMessage: message,
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getChatMessages = async (
  userName: string | undefined,
  currentChatWith: string | undefined
): Promise<userMessages> => {
  try {
    const res = await api.get(
      `/chat/${userName}?chatUserId=${currentChatWith}`
    );
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const refreshAuserChat = async (
  currentChattingUser: string,
  setChatUsers: Dispatch<React.SetStateAction<ChatUsersType[]>>
) => {
  const user = Cookies.get("userName");
  const loggedInUser = await getUserDetails(user as string);

  const userSendingMessage = loggedInUser.data.data.messages.filter(
    (msg) => msg.user_id === currentChattingUser
  );

  const [userMessage] = userSendingMessage;

  if (userMessage) {
    setChatUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.user === currentChattingUser
          ? {
              ...user,
              unreadMsgs: userMessage?.unread,
              recentMsg:
                userMessage.chats[userMessage.chats.length - 1].message,
            }
          : user
      )
    );
  }
};

export const resetUserUnreadMessages = async (
  userName: string | undefined,
  currentChatWith: string | undefined
) => {
  try {
    const res = await api.patch(`/chat/resetunread/${userName}`, {
      chatUserId: currentChatWith,
    });
    console.log("The response of reset is:", res);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default api;
