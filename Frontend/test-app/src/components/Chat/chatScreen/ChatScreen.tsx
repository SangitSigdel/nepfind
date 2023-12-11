import { useContext, useState } from "react";

import ChatContext from "../context/ChatContext";
import { ChatHeader } from "./component/ChatHeader";
import { ChatMessages } from "./component/ChatMessages";
import { ChatScreenWrapper } from "../style";
import { InitialScreen } from "./component/InitialScreen";
import { MessageInput } from "./component/MessageInput";
import { chatHandlers } from "../chatHandlers";

export const ChatScreen = () => {
  const [message, setMessage] = useState<string>("");

  const chatContext = useContext(ChatContext);
  const { sendPrivateMessage } = chatHandlers(chatContext);

  return (
    <ChatScreenWrapper>
      {chatContext.currentChatWith ? (
        <div>
          <ChatHeader currentChatWith={chatContext.currentChatWith.username} />
          <ChatMessages chatMessages={chatContext.chatMessages} />
          <MessageInput
            message={message}
            setMessage={setMessage}
            sendPrivateMessage={sendPrivateMessage}
          />
        </div>
      ) : (
        <InitialScreen />
      )}
    </ChatScreenWrapper>
  );
};
