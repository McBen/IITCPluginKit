import { getIPKFolder, runScript } from "../Run";


export const commandBuildDEV = (argv: any): void => {
    const myargs = ["webpack", "--config", getIPKFolder() + "/config/webpack.dev.js"];
    if (argv.watch) myargs.push("--watch");
    void runScript(myargs);
};

export const commandBuildPROD = (argv: any): void => {
    const myargs = ["webpack", "--config", getIPKFolder() + "/config/webpack.prod.js"];
    if (argv.watch) myargs.push("--watch");
    void runScript(myargs);
};
