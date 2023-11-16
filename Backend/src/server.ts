import "dotenv/config";

import { Server, Socket } from "socket.io";

import app from "./app";
import http from "http";
import mongoDbConnect from "./utils/mongoDbConnect";
import { socketConnect } from "./utils/socketConnect";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const PORT = process.env.PORT;

const db = process.env.DATABASE_URI || "";

mongoDbConnect(db);

socketConnect();

server.listen(PORT, () => {
  console.log(`Server is running in the port ${PORT}`);
});
