import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";

import { ChatMessages } from "./ChatMessages";
import { ThemeProvider } from "styled-components";

window.HTMLElement.prototype.scrollIntoView = function () {};

const chatMessagesData = [
  {
    chat_id: 0,
    message: "hello world",
    messageByUser: true,
    seen: false,
  },
  {
    chat_id: 1,
    message: "hello world1",
    messageByUser: false,
    seen: false,
  },
  {
    chat_id: 2,
    message: "hello world2",
    messageByUser: true,
    seen: true,
  },
  {
    chat_id: 3,
    message: "hello world3",
    messageByUser: true,
    seen: false,
  },
  {
    chat_id: 4,
    message: "hello world4",
    messageByUser: false,
    seen: false,
  },
  {
    chat_id: 5,
    message: "hello world5",
    messageByUser: true,
    seen: true,
  },
];

const customTheme = {
  palette: {
    bright: {
      main: "#ffff",
    },
    chatBubble: {
      sendMessageBubble: "#202c33ce",
      recieveMessageBubble: "green",
    },
  },
};

describe("ChatMessage Component", () => {
  test("chat messages must be rendered", () => {
    render(
      <ThemeProvider theme={customTheme}>
        <ChatMessages chatMessages={chatMessagesData} />
      </ThemeProvider>
    );
    chatMessagesData.forEach((chatMessage) => {
      const messageElement = screen.queryByText(chatMessage.message);
      expect(messageElement).toBeInTheDocument();
    });
  });
});
