import { AxiosResponse } from "axios";
import { ChatMessagesType } from "./components/Chat/types";

export type userData = AxiosResponse<{
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
