import { Server, Socket } from "socket.io";

import app from "./app";
import dotenv from "dotenv";
import http from "http";
import { socketConnect } from "./utils/socketConnect";

dotenv.config();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const PORT = process.env.PORT || 5000;

socketConnect();

server.listen(PORT, () => {
  console.log(`Server is running in the port ${PORT}`);
});
