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
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messageEndRef.current &&
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const ChatMessagesList = () => (
    <ChatListWrapper>
      {chatMessages?.map((chat, index) => (
        <MessagesWrapper messagebyuser={chat.messagebyuser} key={index}>
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
