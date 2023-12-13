import {
  MessageInput,
  MessageInputProps,
} from "../../chatScreen/component/MessageInput";
import { Meta, StoryFn } from "@storybook/react";

import { ThemeProvider } from "styled-components";
import theme from "../../../../utils/theme";

export default {
  title: "ChatScreen/MessageInput",
  component: MessageInput,
} as Meta;

const Template: StoryFn<MessageInputProps> = (args) => {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ background: "#202c33" }}>
        <MessageInput {...args} />
      </div>
    </ThemeProvider>
  );
};

export const Default = Template.bind({});

Default.args = {
  message: "",
  setMessage: () => {},
  sendPrivateMessage: (content: string) => {
    console.log("sending message");
  },
};
