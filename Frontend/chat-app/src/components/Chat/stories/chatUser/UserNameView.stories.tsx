import { ChatUsersType } from "../../types";
import { StoryFn } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import { UserNameView } from "../../chatUser/components/UserNameView";
import theme from "../../../../utils/theme";

export default {
  title: "ChatUser/UserNameView",
  component: UserNameView,
};

const Template: StoryFn<{ user: ChatUsersType }> = (args) => {
  return (
    <div style={{ background: "#0c1317" }}>
      <ThemeProvider theme={theme}>
        <UserNameView {...args} />
      </ThemeProvider>
    </div>
  );
};

export const Default = Template.bind({});

Default.args = {
  user: {
    user: "abc",
    status: "online",
    userId: "abc",
    unreadMsgs: 1,
    recentMsg: "Hello how are you",
  },
};
