import { spawn } from "node:child_process";
import path from "node:path";


/**
 * Gets the folder path where the iitcpluginkit package is located.
 * @returns The directory path of the iitcpluginkit package.
 */
export const getIPKFolder = (): string => {
    const rootdir = import.meta.resolve(`iitcpluginkit/package.json`);
    const dirname = path.dirname(rootdir);
    return dirname;
}


/**
 * Runs a script using npm_execpath with the provided arguments.
 * @param args - Array of string arguments to pass to the script.
 * @returns A promise that resolves to the exit code (0 for success).
 * @throws Error if the command fails (non-zero exit code).
 */
export const runScript = async (args: string[]): Promise<number> => {
    return new Promise((resolve, reject) => {
        const cmdLine = "$npm_execpath run " + args.join(" ");
        const proc = spawn(cmdLine, { stdio: "inherit", shell: true });
        proc.on("close", code => {
            if (code === 0) {
                resolve(code)
            } else {
                reject(new Error(`command failed ${cmdLine}`));
            }
        });
    });
}

