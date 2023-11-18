import cors from "cors";
import express from "express";
import userRouter from "./routes/userRouter";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1/user", userRouter);

app.use((req, res, next) => {
  res.status(404).send({
    message: "sorry the requested url was not found",
  });
});

export default app;
