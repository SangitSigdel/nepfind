import ChatContext from "../context/ChatContext";
import { NewChatScreen } from "./ChatUsers";
import { StoryFn } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import theme from "../../../utils/theme";

export default {
  title: "ChatUser/ChatUsers",
  component: NewChatScreen,
};

const Template: StoryFn = (args) => {
  return (
    <div style={{ background: "#0c1317" }}>
      <ThemeProvider theme={theme}>
        <ChatContext.Provider value={args.chatContext}>
          <NewChatScreen />
        </ChatContext.Provider>
      </ThemeProvider>
    </div>
  );
};

export const Default = Template.bind({});

Default.args = {
  chatContext: {
    setDisplayOnlinUsers: () => {},
    displayOnlineUsers: false,
    setCurrentChatWith: () => {},
    setChatUsers: () => {},
    currentChatWith: "",
    chatUsers: [
      {
        user: "TestUser1",
        status: "online",
        userId: "abc",
        unreadMsgs: 0,
        recentMsg: "Check Message 1",
      },
      {
        user: "TestUser2",
        status: "offline",
        userId: "abcd",
        unreadMsgs: 1,
        recentMsg: "Check Message 2",
      },
    ],
  },
};
