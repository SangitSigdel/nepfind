import { ChatScreenContainer, MessagesWrapper } from "../../style";
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

  return (
    <ChatScreenContainer maxWidth="xl">
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {chatMessages?.map((chat, index) => {
          return (
            <MessagesWrapper messageByUser={chat.messageByUser} key={index}>
              <p style={{ maxWidth: "20rem", padding: "5px" }}>
                {chat.message}
              </p>
              <div ref={messageEndRef} />
            </MessagesWrapper>
          );
        })}
      </div>
    </ChatScreenContainer>
  );
};
