import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

import root from "./root";

// const NODE_ENV = process.env.NODE_ENV;
// const isProd = NODE_ENV === "production";

export default {
  entry: {
    app: [root("client/app/index.tsx")],
  },

  output: {
    path: root("dist"),
    publicPath: "/",
    filename: "js/[name].[contenthash:8].js",
    chunkFilename: "[id].[chunkhash:8].chunk.js",
  },

  resolve: {
    extensions: [
      ".json",
      ".ts",
      ".tsx",
      ".js",
      ".css",
      ".scss",
      ".html",
      ".png",
      ".jpg",
      ".jpeg",
    ],
    alias: {
      app: "client/app",
    },
  },

  module: {
    rules: [
      // JS files
      {
        test: /\.(j|t)sx?$/,
        include: root("client"),
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },

      // SCSS files
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-modules-typescript-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"],
              },
            },
          },
          "sass-loader",
        ],
      },
      // CSS files (for Bootstrap)
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"],
              },
            },
          },
        ],
      },

      // Images
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    
    new HtmlWebpackPlugin({
      template: root("client/public/index.html"),
      inject: "body",
    }),

    new ForkTsCheckerWebpackPlugin({
      async: false,
      eslint: {
        files: root("client/**/*.tsx"),
      },
    }),
  ],
};
