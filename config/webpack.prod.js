import { merge } from "webpack-merge";
import path from "node:path";
import fs from "node:fs";
import TerserPlugin from "terser-webpack-plugin";

process.env.NODE_ENV = "production";

const commonConfig = await import("./webpack.common.js");
let develConfig = merge(commonConfig.default, {
  output: {
    filename: `${global.config.id || "myplugin"}.user.js`,
    path: path.resolve(process.cwd(), "dist"),
    publicPath: "",
  },

  plugins: [],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: "pre",
        exclude: /(node_modules|\.spec\.js)/,
        use: [
          {
            loader: "webpack-strip-block",
            options: {
              start: "DEBUG-START",
              end: "DEBUG-END",
            },
          },
        ],
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
      !!global.config.minimize
        ? new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
              },
            },
          })
        : new TerserPlugin({
            terserOptions: {
              compress: {
                pure_funcs: [
                  "console.log",
                  "console.assert",
                  "console.debug",
                  "console.info",
                  "console.time",
                  "console.timeEnd",
                  "console.timeLog",
                ],
              },
              mangle: false,
              keep_classnames: true,
              keep_fnames: true,
              format: {
                beautify: true,
              },
            },
          }),
    ],
  },
});

try {
  let userConfig;
  ["webpack.config.cjs", "webpack.config.js"].some(async (name) => {
    const pname = path.resolve(process.cwd(), name);
    if (fs.existsSync(pname)) {
      userConfig = await import(pname);
      return true;
    }
  });

  if (typeof userConfig === "function") {
    userConfig(develConfig);
  } else {
    if (userConfig) {
      develConfig = merge(develConfig, userConfig.default);
    }
  }
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") {
    console.log(error);
  }
}

export default develConfig;
