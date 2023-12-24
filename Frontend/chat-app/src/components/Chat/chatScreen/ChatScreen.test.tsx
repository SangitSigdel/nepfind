import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";

import ChatContext from "../context/ChatContext";
import { ChatScreen } from "./ChatScreen";
import { ThemeProvider } from "styled-components";

window.HTMLElement.prototype.scrollIntoView = function () {};

const customContext = {
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
  ],
  setChatMessages: () => {},
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
  setChatUsers: () => {},
  onlineUsers: [
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
  setOnlineUsers: () => {},
  currentChatWith: {
    username: "test",
    userID: "test",
  },
  setCurrentChatWith: () => {},
  displayOnlineUsers: true,
  setDisplayOnlinUsers: () => {},
};

const customTheme = {
  palette: {
    primary: {
      light: "#202c33",
    },
    bright: {
      main: "#ffff",
    },
    chatBubble: {
      sendMessageBubble: "#202c33ce",
      recieveMessageBubble: "green",
    },
  },
};

const { currentChatWith, ...contextWithoutCurrentChatWith } = customContext;

describe("ChatScreen no chat user", () => {
  test("should render all components", () => {
    render(
      <ChatContext.Provider value={contextWithoutCurrentChatWith}>
        <ChatScreen />
      </ChatContext.Provider>
    );
    const initialScreenTextElement = screen.getByText(
      "Select Chat To Continue"
    );
    expect(initialScreenTextElement).toBeInTheDocument();
  });
});

describe("ChatScreen with chat Users", () => {
  test("should render message input box and a send button", () => {
    render(
      <ThemeProvider theme={customTheme}>
        <ChatContext.Provider value={customContext}>
          <ChatScreen />
        </ChatContext.Provider>
      </ThemeProvider>
    );
    const messageInputBoxElement = screen.getByRole("textbox");
    const sendButtonElement = screen.getByRole("button");

    expect(messageInputBoxElement).toBeInTheDocument();
    expect(sendButtonElement).toBeInTheDocument();
  });
});
