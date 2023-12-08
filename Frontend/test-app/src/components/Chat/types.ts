import { Dispatch } from "react";

export type ChatMessagesType = {
  chat_id: number;
  message: string;
  messageByUser: boolean;
  dateTime?: string;
  _id?: string;
  seen: boolean;
};

export type CurrentChatWithType = {
  username: string;
  userID: string;
};

export type ChatScreenProps = {
  chatMessages: ChatMessagesType[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessagesType[]>>;
  chatMessagesWith?: CurrentChatWithType;
  sendPrivateMessage: (content: string) => void;
};

export interface UserData {
  status: string;
  data: Data;
}
export interface Data {
  _id: string;
  user_id: string;
  user_name: string;
  online: boolean;
  messages?: MessagesEntity[] | null;
  __v: number;
}
export interface MessagesEntity {
  user_id: string;
  chats?: ChatsEntity[] | null;
  _id: string;
}
export interface ChatsEntity {
  chat_id: number;
  message: string;
  messageByUser: boolean;
  dateTime: string;
  _id: string;
}

export type ChatUsersType = {
  user: string;
  status: string;
  userId: string;
  unreadMsgs: number;
  recentMsg: string;
};

export type ChatUsersProps = {
  users: ChatUsersType[];
  onlineUsers: ChatUsersType[];
  setCurrentChatWith: Dispatch<
    React.SetStateAction<CurrentChatWithType | undefined>
  >;
  setChatUsers: Dispatch<React.SetStateAction<ChatUsersType[]>>;
  currentChatWith?: CurrentChatWithType;
  chatMessages: ChatMessagesType[];
};

export type ServerMessageContent = {
  content: string;
  from: string;
  to: {
    username: string;
    userID: string;
  };
  userName: string;
};
