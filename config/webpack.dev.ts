import { WebpackConfiguration } from "webpack-dev-server";
import { merge } from "webpack-merge";

import commonConfig from "./webpack.common";

const config: WebpackConfiguration = {
  devtool: "eval-source-map",

  mode: "development",

  devServer: {
    hot: true,
    static: "./client/public",
    historyApiFallback: {
      index: "index.html",
    },
    compress: true,
    port: 8080,
    proxy: {
      "/api/": "http://127.0.0.1:9090/",
    },
  },
};
export default merge<WebpackConfiguration>(commonConfig, config);
