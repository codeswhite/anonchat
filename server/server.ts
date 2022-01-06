import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";

import config from "../config/config";

const isDev: boolean = process.env.NODE_ENV !== "production";
const port: number = parseInt(process.env.PORT!) || 8080;

// Configuration
// ================================================================================================

// Set up Mongoose
mongoose.connect(isDev ? config.db_dev : config.db).then((res) => {
  console.log(`[DB] Connected to: ${res.connection.host}`);
});
mongoose.Promise = global.Promise;

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(isDev ? "dev" : "common"));

import apiUsers from "./routes/api/Users";
app.use("/api/users", apiUsers);
import apiChats from "./routes/api/Chats";
app.use("/api/chats", apiChats);

if (!isDev) {
  app.use(express.static(path.resolve(__dirname, "../dist")));
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../dist/index.html"));
  });
}

app
  .listen(port, "0.0.0.0", () => {
    console.info(">>> 🌎 Open http://0.0.0.0:%s/ in your browser.", port);
  })
  .on("error", (err) => {
    if (err) {
      console.log(err);
    }
  });

export default app;
