import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";

import ChatContext from "../../context/ChatContext";
import { OnlineUserView } from "./OnlineUserView";
import { ThemeProvider } from "styled-components";

const chatContextValue = {
  chatMessages: [],
  setChatMessages: () => {},
  setChatUsers: () => {},
  chatUsers: [],
  setOnlineUsers: () => {},
  currentChatWith: undefined,
  setCurrentChatWith: () => {},
  displayOnlineUsers: false,
  setDisplayOnlinUsers: () => {},

  onlineUsers: [
    {
      user: "testUser1",
      status: "online",
      userId: "testUser1",
      unreadMsgs: 1,
      recentMsg: "test unread message",
    },
    {
      user: "testUser2",
      status: "online",
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
        <OnlineUserView />
      </ChatContext.Provider>
    </ThemeProvider>
  );

describe("OnlineUserView component", () => {
  test("should display online users", () => {
    renderComponent();
    chatContextValue.onlineUsers.forEach((onlineUser) => {
      const onlineUserElement = screen.getByText(onlineUser.user);
      expect(onlineUserElement).toBeInTheDocument();
    });
  });
  test("should display online green dot", () => {
    renderComponent();
    const statusCircles = screen.getAllByTestId("statusCircle");
    statusCircles.forEach((statusCircle) => {
      expect(statusCircle).toHaveStyle(`background-color:green`);
    });
  });
  test("should display back arrow button", () => {
    renderComponent();
    const backArrowButton = screen.getByRole("button");
    expect(backArrowButton).toBeInTheDocument();
  });
});
