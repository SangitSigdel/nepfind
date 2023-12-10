import {
  ChatContextType,
  ChatMessagesType,
  ChatUsersType,
  CurrentChatWithType,
} from "../types";
import React, { ReactElement, createContext, useState } from "react";

const initialChatContextData = {
  chatMessages: [],
  setChatMessages: () => {},
  chatUsers: [],
  setChatUsers: () => {},
  onlineUsers: [],
  setOnlineUsers: () => {},
  currentChatWith: undefined,
  setCurrentChatWith: () => {},
  displayOnlineUsers: false,
  setDisplayOnlinUsers: () => {},
};

const ChatContext = createContext<ChatContextType>(initialChatContextData);

export const ChatContextProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessagesType[]>([]);

  const [chatUsers, setChatUsers] = useState<ChatUsersType[]>([]);

  const [onlineUsers, setOnlineUsers] = useState<ChatUsersType[]>([]);

  const [currentChatWith, setCurrentChatWith] = useState<CurrentChatWithType>();

  const [displayOnlineUsers, setDisplayOnlinUsers] = useState<boolean>(false);

  const chatContextProviderValue: ChatContextType = {
    chatMessages,
    setChatMessages,
    onlineUsers,
    setOnlineUsers,
    chatUsers,
    setChatUsers,
    currentChatWith,
    setCurrentChatWith,
    displayOnlineUsers,
    setDisplayOnlinUsers,
  };

  return (
    <ChatContext.Provider value={chatContextProviderValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
