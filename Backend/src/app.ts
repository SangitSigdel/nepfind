import chatRouter from "./routes/chatRoutes";
import express from "express";

const app = express();

app.use(express.json());

app.use("/api/v1/chat", chatRouter);

app.use((req, res, next) => {
  res.status(404).send({
    message: "sorry the requested url was not found",
  });
});

export default app;
