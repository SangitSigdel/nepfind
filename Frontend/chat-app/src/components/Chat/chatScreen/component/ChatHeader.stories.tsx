import { ChatHeader } from "./ChatHeader";
import { Meta } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import theme from "../../../../utils/theme";

const Component = ({ currentChatWith }: { currentChatWith: string }) => {
  return (
    <ThemeProvider theme={theme}>
      <ChatHeader currentChatWith={currentChatWith} />
    </ThemeProvider>
  );
};

export default {
  component: Component,
  title: "ChatScreen/ChatHeader",
} as Meta;

export const Default = {
  args: {
    currentChatWith: "user1",
  },
};
