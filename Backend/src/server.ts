import { Server, Socket } from "socket.io";

import dotenv from "dotenv";
import http from "http";

dotenv.config();

const server = http.createServer();

interface CustomSocket extends Socket {
  username?: string;
}

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.use((socket: CustomSocket, next) => {
  const username = socket.handshake.auth.userName as string;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket: CustomSocket) => {
  // fetch existing users
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: (socket as CustomSocket).username,
    });
  }

  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: (socket as CustomSocket).username,
  });

  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", {
      userID: socket.id,
      username: socket.username,
    });
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running in the port ${PORT}`);
});
