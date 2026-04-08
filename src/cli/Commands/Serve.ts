import path from "node:path";
import { spawn } from "node:child_process";
import { getIPKFolder } from "../Run";


export const commandServe = (): void => {
    const mpath = getIPKFolder().replace("file:/", "");
    const scriptPath = path.join(mpath, "/config/fileserver.js");

    const proc = spawn(
        "node",
        [scriptPath, ...process.argv.slice(3)],
        { stdio: "inherit" },
    );
    proc.on("error", (error: Error) => {
        console.error(error);
    });
}