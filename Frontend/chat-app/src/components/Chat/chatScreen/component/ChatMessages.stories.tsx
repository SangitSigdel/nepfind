import { ChatMessages } from "./ChatMessages";
import { ChatMessagesType } from "../../types";
import { Meta } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import theme from "../../../../utils/theme";

const chatMessagesData = [
  {
    chat_id: 0,
    message: "hello world",
    messagebyuser: true,
    seen: false,
  },
  {
    chat_id: 1,
    message: "hello world1",
    messagebyuser: false,
    seen: false,
  },
  {
    chat_id: 2,
    message: "hello world2",
    messagebyuser: true,
    seen: true,
  },
];

const Component = ({ chatMessages }: { chatMessages: ChatMessagesType[] }) => {
  return (
    <ThemeProvider theme={theme}>
      <ChatMessages chatMessages={chatMessages} />
    </ThemeProvider>
  );
};

export default {
  component: Component,
  title: "ChatScreen/ChatMessages",
} as Meta;
export const Default = {
  args: {
    chatMessages: chatMessagesData,
  },
};
