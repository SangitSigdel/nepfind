import ChatContext from "../../context/ChatContext";
import { OnlineUserView } from "../../chatUser/components/OnlineUserView";
import { StoryFn } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import theme from "../../../../utils/theme";

export default {
  title: "ChatUser/OnlineUserView",
  component: OnlineUserView,
};

const Template: StoryFn = (args) => {
  return (
    <div style={{ background: "#0c1317" }}>
      <ThemeProvider theme={theme}>
        <ChatContext.Provider value={args.chatContext}>
          <OnlineUserView />
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
    setDisplayOnlinUsers: () => {},
    onlineUsers: [
      {
        user: "test",
        status: "online",
        userId: "abcd",
        unreadMsgs: 0,
        recentMsg: "test message",
      },
      {
        user: "test2",
        status: "offline",
        userId: "abcd3",
        unreadMsgs: 1,
        recentMsg: "check message2",
      },
    ],
  },
};
