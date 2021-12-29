import { Configuration } from "webpack";
import { merge } from "webpack-merge";

import commonConfig from "./webpack.common";

const config: Configuration = {
  devtool: "eval-source-map",

  mode: "development",

  devServer: {
    static: "./client/public",
    historyApiFallback: true,
    compress: true,
  },
};
export default merge<Configuration>(commonConfig, config);
