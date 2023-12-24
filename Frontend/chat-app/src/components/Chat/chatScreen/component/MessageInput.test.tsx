import "@testing-library/jest-dom/extend-expect";

import { fireEvent, render, screen } from "@testing-library/react";

import { MessageInput } from "./MessageInput";
import { ThemeProvider } from "styled-components";

const customTheme = {
  palette: {
    bright: {
      main: "#ffff",
    },
  },
};

const message = "";
const setMessage = jest.fn();
const sendPrivateMessage = jest.fn();

const renderComponenet = () => {
  return render(
    <ThemeProvider theme={customTheme}>
      <MessageInput
        message={message}
        setMessage={setMessage}
        sendPrivateMessage={sendPrivateMessage}
      />
    </ThemeProvider>
  );
};

describe("MessageInput Component", () => {
  test("should render message box and send icon", () => {
    renderComponenet();
    const messageInputElement = screen.getByRole("textbox");
    const sendButtonElement = screen.getByRole("button");

    expect(messageInputElement).toBeInTheDocument();
    expect(sendButtonElement).toBeInTheDocument();
  });

  test("should setMessage state on user input", async () => {
    renderComponenet();
    const messageInputElement = screen.getByRole("textbox");
    fireEvent.change(messageInputElement, { target: { value: "hello world" } });

    expect(setMessage).toBeCalledWith("hello world");
  });
});
