import express, { Application } from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";

import config from "../config/config";
import webpackConfigDev from "../config/webpack.dev";
import webpackConfigProd from "../config/webpack.prod";

const isDev: boolean = process.env.NODE_ENV !== "production";
const port: number = parseInt(process.env.PORT!) || 8080;

import countersApi from "./routes/api/User";

// Configuration
// ================================================================================================

// Set up Mongoose
mongoose
  .connect(isDev ? config.db_dev : config.db)
  .then((res) => {
    console.log(`[DB] Connected to: ${res.connection.host}`);
  });
mongoose.Promise = global.Promise;

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(isDev ? "dev" : "common"));

if (isDev) {
  const compiler = webpack(webpackConfigDev);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfigDev.output!.publicPath,
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false,
      },
    })
  );

  app.use(express.static(path.resolve(__dirname, "../dist")));
} else {
  webpack(webpackConfigProd);
  app.use(express.static(path.resolve(__dirname, "../dist")));
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../dist/index.html"));
    res.end();
  });
}
// import api from './routes/index';

app.use("/api/counters/", countersApi);

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
// module.exports = app;
