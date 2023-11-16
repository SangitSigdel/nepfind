import mongoose from "mongoose";

const mongoDbConnect = (dbUri: string) => {
  mongoose
    .connect(dbUri)
    .then((con) => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("The database connection error is:", error);
    });
};

export default mongoDbConnect;
