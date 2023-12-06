import {
  ChatListWrapper,
  ChatScreenContainer,
  MessagesWrapper,
} from "../../style";
import React, { useEffect, useRef } from "react";

import { ChatMessagesType } from "../../types";

export const ChatMessages = ({
  chatMessages,
}: {
  chatMessages: ChatMessagesType[];
}) => {
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const ChatMessagesList = () => (
    <ChatListWrapper>
      {chatMessages?.map((chat, index) => (
        <MessagesWrapper messageByUser={chat.messageByUser} key={index}>
          {chat.message}
          <div ref={messageEndRef} />
        </MessagesWrapper>
      ))}
    </ChatListWrapper>
  );

  return (
    <ChatScreenContainer maxWidth="xl">
      <ChatMessagesList />
    </ChatScreenContainer>
  );
};