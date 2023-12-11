import { ChatContextType } from "../../components/Chat/types";
import Cookies from "js-cookie";
import { chatHandlers } from "../../components/Chat/chatHandlers";
import { io } from "socket.io-client";

const URL = "http://localhost:5000";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export const socketHandler = (chatContext: ChatContextType) => {
  const userName = Cookies.get("userName");

  const {
    handleChatUsers,
    handleUserConnected,
    handleUserDiconnected,
    handlePrivateMessages,
    handleConnectionError,
  } = chatHandlers(chatContext);

  socket.connect();
  socket.auth = { userName };

  socket.on("users", handleChatUsers);
  socket.on("user connected", handleUserConnected);
  socket.on("user disconnected", handleUserDiconnected);
  socket.on("private message", handlePrivateMessages);
  socket.on("connect_error", handleConnectionError);
};

export const handleSocketOff = () => {
  socket.off("connect_error");
  socket.off("users");
  socket.off("user connected");
  socket.off("user disconnected");
  socket.off("private message");
};

export default socket;
