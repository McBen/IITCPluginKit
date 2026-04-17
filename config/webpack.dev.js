import { merge } from "webpack-merge";
import path from "node:path";
import fs from "node:fs";
import dateFormat from "dateformat";
import gitDescribe from "git-describe";

process.env.NODE_ENV = "development";

// create special version strings
global.versionString = function () {
  let version = "v0.0.0";
  try {
    const git = gitDescribe.gitDescribeSync(".");
    if (git.semverString) version = "v" + git.semverString;
    else if (git.tag) version = git.tag;
    else if (git.raw) version = git.raw;
  } catch (_) {}

  return version;
};

global.versionStringScript = function () {
  const version = config.version || getGitTag();
  let now = new Date();
  let str = version.replace(/^v/, "") + "." + dateFormat(now, "yymmdd.HHMMss");

  return str;
};

const commonConfig = await import("./webpack.common.js");
let develConfig = merge(commonConfig.default, {
  output: {
    filename: `${global.config.id || "myplugin"}.dev.user.js`,
    path: path.resolve(process.cwd(), "dist"),
    devtoolModuleFilenameTemplate: `webpack://[namespace]/${global.config.id || "myplugin"}/[resource-path]?[loaders]`,
    publicPath: "",
  },
});

try {
  let userConfig;
  const configfiles = ["webpack.config.cjs", "webpack.config.js"];
  for (const name of configfiles) {
    const pname = path.resolve(process.cwd(), name);
    if (fs.existsSync(pname)) {
      console.log(`loading user config ${name}`);
      userConfig = await import(pname);
      break;
    }
  }

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
