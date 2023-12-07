import { ChatHeader } from "./component/ChatHeader";
import { ChatMessages } from "./component/ChatMessages";
import { ChatScreenProps } from "../types";
import { ChatScreenWrapper } from "../style";
import { InitialScreen } from "./component/InitialScreen";
import { MessageInput } from "./component/MessageInput";
import { useState } from "react";

export const ChatScreen = ({
  chatMessages,
  chatMessagesWith,
  sendPrivateMessage,
}: ChatScreenProps) => {
  const [message, setMessage] = useState<string>("");

  return (
    <ChatScreenWrapper>
      {chatMessagesWith ? (
        <ChatHeader currentChatWith={chatMessagesWith.username} />
      ) : (
        <InitialScreen />
      )}

      <ChatMessages chatMessages={chatMessages} />

      {chatMessagesWith && (
        <MessageInput
          message={message}
          setMessage={setMessage}
          sendPrivateMessage={sendPrivateMessage}
        />
      )}
    </ChatScreenWrapper>
  );
};
