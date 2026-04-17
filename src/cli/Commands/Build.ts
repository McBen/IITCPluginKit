import { isCurrentVersion } from "../ConfigFiles/Plugin";
import { getIPKFolder, runScript } from "../Run";
import { migrate } from "./Migrate";


export const commandBuildDEV = (argv: any): void => {

    if (!isCurrentVersion()) migrate();

    const myargs = ["webpack", "--config", getIPKFolder() + "/config/webpack.dev.js"];
    if (argv.watch) myargs.push("--watch");
    void runScript(myargs).catch(() => {/** noop - just prevent stack dump */ });
};


export const commandBuildPROD = (argv: any): void => {
    if (!isCurrentVersion()) migrate();

    const myargs = ["webpack", "--config", getIPKFolder() + "/config/webpack.prod.js"];
    if (argv.watch) myargs.push("--watch");
    void runScript(myargs);
};
