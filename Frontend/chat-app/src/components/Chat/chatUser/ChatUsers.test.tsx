import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";

import ChatContext from "../context/ChatContext";
import { ChatUsers } from "./ChatUsers";
import Cookies from "js-cookie";
import React from "react";
import { ThemeProvider } from "styled-components";
import user from "@testing-library/user-event";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
}));

const mockContextValue = {
  chatMessages: [],
  setChatMessages: () => {},
  setChatUsers: () => {},
  onlineUsers: [
    {
      user: "testUser3",
      status: "online",
      userId: "testUser3",
      unreadMsgs: 1,
      recentMsg: "test unread message",
    },
    {
      user: "testUser4",
      status: "online",
      userId: "testUser4",
      unreadMsgs: 0,
      recentMsg: "test2 unread message",
    },
  ],
  setOnlineUsers: () => {},
  currentChatWith: undefined,
  setCurrentChatWith: () => {},
  displayOnlineUsers: false,
  setDisplayOnlinUsers: jest.fn(),

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
      <ChatContext.Provider value={mockContextValue}>
        <ChatUsers />
      </ChatContext.Provider>
    </ThemeProvider>
  );

describe("ChatUser component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should render loggedIn userName", () => {
    const mockUsername = "TestUser";
    (Cookies.get as jest.Mock).mockReturnValue(mockUsername);

    renderComponent();

    const loggedInUserElement = screen.getByRole("heading", { level: 5 });

    expect(loggedInUserElement).toBeInTheDocument();
    expect(loggedInUserElement).toHaveTextContent("TestUser");
  });

  test("should have a personadd icon button", () => {
    renderComponent();
    const personAddIconElement = screen.getByTestId("btnViewOnlineUser");
    expect(personAddIconElement).toBeInTheDocument();
  });

  test("initially should display chat users", () => {
    renderComponent();
    mockContextValue.chatUsers.forEach((user) => {
      const userElement = screen.getByText(user.user);
      expect(userElement).toBeInTheDocument();
    });
  });

  test("should display online users when clicked person add icon", async () => {
    renderComponent();
    user.setup();
    const personAddIconElemnent = screen.getByTestId("btnViewOnlineUser");

    await user.click(personAddIconElemnent);

    expect(mockContextValue.setDisplayOnlinUsers).toHaveBeenCalledWith(true);

    mockContextValue.onlineUsers.forEach(async (onlineuser) => {
      const onlineUserElement = await screen.findByText(onlineuser.user);
      expect(onlineUserElement).toBeInTheDocument();
    });
  });
});
