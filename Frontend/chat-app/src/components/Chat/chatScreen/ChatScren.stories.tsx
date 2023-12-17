import ChatContext from "../context/ChatContext";
import { ChatScreen } from "./ChatScreen";
import { StoryFn } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import theme from "../../../utils/theme";

export default {
  title: "ChatScreen/ChatScreen",
  component: ChatScreen,
};

const Template: StoryFn = (args) => {
  return (
    <div style={{ background: "#0c1317" }}>
      <ChatContext.Provider value={args.chatContext}>
        <ThemeProvider theme={theme}>
          <ChatScreen {...args} />
        </ThemeProvider>
      </ChatContext.Provider>
    </div>
  );
};

export const WithNoChats = Template.bind({});

WithNoChats.args = {
  chatContext: {
    currentChatWith: null,
  },
};

export const WithChats = Template.bind({});

WithChats.args = {
  chatContext: {
    currentChatWith: {
      username: "testUser",
    },
    chatMessages: [
      {
        chat_id: 0,
        message: "hello",
        messageByUser: true,
        seen: false,
      },
      {
        chat_id: 1,
        message: "how are you",
        messageByUser: false,
        seen: true,
      },
      {
        chat_id: 0,
        message: "hi",
        messageByUser: true,
        seen: false,
      },
      {
        chat_id: 1,
        message: "hello",
        messageByUser: false,
        seen: true,
      },
      {
        chat_id: 0,
        message: "test1",
        messageByUser: true,
        seen: false,
      },
      {
        chat_id: 1,
        message: "test2",
        messageByUser: true,
        seen: true,
      },
    ],
  },
};
