import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";

import ChatContext from "../../context/ChatContext";
import { ChatUserView } from "./ChatUserView";
import { ThemeProvider } from "styled-components";

const chatContextValue = {
  chatMessages: [],
  setChatMessages: () => {},
  setChatUsers: () => {},
  onlineUsers: [],
  setOnlineUsers: () => {},
  currentChatWith: undefined,
  setCurrentChatWith: () => {},
  displayOnlineUsers: false,
  setDisplayOnlinUsers: () => {},

  chatUsers: [
    {
      user: "testUser1",
      status: "online",
      userId: "testUser1",
      unreadMsgs: 1,
      recentMsg: "test unread message",
    },
    {
      user: "testUser2",
      status: "offline",
      userId: "testUser2",
      unreadMsgs: 0,
      recentMsg: "test2 unread message",
    },
  ],
};

const customTheme = {
  palette: {
    primary: {
      light: "",
      main: "",
      dark: "",
    },
    border: {
      main: "",
    },
    bright: {
      light: "",
    },
  },
};

const renderComponent = () =>
  render(
    <ThemeProvider theme={customTheme}>
      <ChatContext.Provider value={chatContextValue}>
        <ChatUserView />
      </ChatContext.Provider>
    </ThemeProvider>
  );

describe("ChatUserView component", () => {
  test("should display chat Users name and recent chats", () => {
    renderComponent();

    chatContextValue.chatUsers.forEach((chatUser) => {
      const chatUserElement = screen.getByText(chatUser.user);
      const recentChatElement = screen.getByText(chatUser.recentMsg);
      expect(chatUserElement).toBeInTheDocument();
      expect(recentChatElement).toBeInTheDocument();
    });
  });

  test("should display unread message chat bubble", () => {
    renderComponent();
    chatContextValue.chatUsers.forEach((chatUsers) => {
      const unreadMessageChatBubbleComponent = screen.getByText(1);
      expect(unreadMessageChatBubbleComponent).toBeInTheDocument();
    });
  });
  test("should display a online status dot", () => {
    renderComponent();

    const statusCircles = screen.getAllByTestId("statusCircle");

    expect(statusCircles.length).toBe(2);

    const bgColors = ["green", "red"];

    statusCircles.forEach((statusCircle, index) => {
      expect(statusCircle).toHaveStyle(`background-color:${bgColors[index]}`);
    });
  });
});
