import { Meta, StoryFn } from "@storybook/react";

import ChatContext from "../../context/ChatContext";
import { ChatUserView } from "./ChatUserView";
import { ThemeProvider } from "styled-components";
import theme from "../../../../utils/theme";

export default {
  title: "ChatUser/ChatUserView",
  component: ChatUserView,
} as Meta;

const Template: StoryFn = (args) => {
  return (
    <div style={{ background: "#0c1317" }}>
      <ThemeProvider theme={theme}>
        <ChatContext.Provider value={args.chatContext}>
          <ChatUserView {...args} />
        </ChatContext.Provider>
      </ThemeProvider>
    </div>
  );
};

export const Default = Template.bind({});

Default.args = {
  chatContext: {
    setChatUsers: () => {},
    setCurrentChatWith: (username: "", userID: "") => {},
    currentChatWith: "",
    chatUsers: [
      {
        user: "user1",
        status: "online",
        userId: "abc",
        unreadMsgs: 0,
        recentMsg: "test message1",
      },
      {
        user: "user2",
        status: "offline",
        userId: "abcd",
        unreadMsgs: 1,
        recentMsg: "test message 2",
      },
    ],
  },
};
