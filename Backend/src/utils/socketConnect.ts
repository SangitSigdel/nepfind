import { Socket } from "socket.io";
import UserModel from "../model/chatModel";
import { io } from "../server";

interface CustomSocket extends Socket {
  username?: string;
}

export const socketConnect = () => {
  io.use((socket: CustomSocket, next) => {
    const username = socket.handshake.auth.userName as string;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
  });

  io.on("connection", (socket: CustomSocket) => {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        username: (socket as CustomSocket).username,
      });
    }

    socket.emit("users", users);

    socket.broadcast.emit("user connected", {
      userID: socket.id,
      username: (socket as CustomSocket).username,
    });

    socket.on(
      "private message",
      ({
        content,
        to,
        fromUserName,
      }: {
        content: string;
        to: {
          username: string;
          userID: string;
        };
        fromUserName: string;
      }) => {
        socket.to(to.userID).emit("private message", {
          content,
          // from: socket.id,
          from: fromUserName,
          to: to,
          userName: socket.username,
        });
      }
    );

    socket.on("disconnect", () => {
      try {
        const user = UserModel.findOneAndUpdate(
          { user_id: socket.username },
          { online: false }
        ).then(() => {
          socket.broadcast.emit("user disconnected", {
            userID: socket.id,
            username: socket.username,
          });
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
};
