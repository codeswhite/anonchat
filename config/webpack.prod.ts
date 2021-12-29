import { Configuration } from "webpack";
import { merge } from "webpack-merge";

import commonConfig from "./webpack.common";

const config: Configuration = {
  mode: "production",
};
export default merge<Configuration>(commonConfig, config);
