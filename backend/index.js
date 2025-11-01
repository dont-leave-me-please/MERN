import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // allows us to parse incoming requests with JSON payloads(res, res)

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log("server is running on port: ", PORT);
  connectDB();
});
