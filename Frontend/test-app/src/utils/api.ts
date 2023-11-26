import Cookies from "js-cookie";
import axios from "axios";
import socket from "./socket";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

const user = Cookies.get("userName");

export const sendMessage = async (
  currentChatWith: string | undefined,
  chatMessage: string
) => {
  try {
    const res = await api.post(`/chat/${user}`, {
      chatUserId: currentChatWith,
      chatMessage: chatMessage,
    });
    socket.emit("private message", {
      content: chatMessage,
      to: currentChatWith,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getChatMessages = async (currentChatWith: string) => {
  try {
    const res = await api.get(`/chat/${user}?chatUserId=${currentChatWith}`);
    return res.data.messages.chats;
  } catch (error) {
    console.log(error);
  }
};

export default api;
