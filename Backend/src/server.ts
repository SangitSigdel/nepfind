import { Server } from "socket.io";
import dotenv from "dotenv";
import http from "http";

dotenv.config();

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: process.env.URL,
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) next(new Error("invalid username"));
  (socket as any).username = username;
  next();
});

io.on("connection", (socket) => {
  // fetch users
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: (socket as any).username,
    });
  }
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: (socket as any).username,
  });

  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });

  // notify users on disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running in the port ${PORT}`);
});
