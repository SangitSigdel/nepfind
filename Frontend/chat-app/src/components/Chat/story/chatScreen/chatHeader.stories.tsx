import { ChatHeader } from "../../chatScreen/component/ChatHeader";
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
  tags: ["autodocs"],
} as Meta;

export const Default = {
  args: {
    currentChatWith: "sangit",
  },
};
