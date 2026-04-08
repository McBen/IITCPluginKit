import { spawn } from "node:child_process";
import path from "node:path";


/**
 * Gets the folder path where the iitcpluginkit package is located.
 * @returns The directory path of the iitcpluginkit package.
 */
export const getIPKFolder = (): string => {
    const rootdir = import.meta.resolve(`iitcpluginkit/package.json`);
    const dirname = path.dirname(rootdir).replace(/^file:/, "");
    return dirname;
}


/**
 * Runs a script using npm_execpath with the provided arguments.
 * @param args - Array of string arguments to pass to the script.
 * @returns A promise that resolves to the exit code (0 for success).
 * @throws Error if the command fails (non-zero exit code).
 */
export const runScript = async (args: string[]): Promise<number> => {
    return runNpmCommand(["run", ...args]);
}

export const addPackage = async (packages: string[], development: boolean = false): Promise<number> => {
    if (isYARN()) {
        return runNpmCommand([development ? "add -D" : "add", ...packages]);
    } else if (isNPM()) {
        return runNpmCommand([development ? "install -D" : "install", ...packages]);
    } else {
        throw new Error("Unsupported package manager. Only npm and yarn are supported.");
    }
}


export const removePackage = async (packages: string[]): Promise<number> => {
    if (isYARN()) {
        return runNpmCommand(["remove", ...packages]);
    } else if (isNPM()) {
        return runNpmCommand(["uninstall", ...packages]);
    } else {
        throw new Error("Unsupported package manager. Only npm and yarn are supported.");
    }
}


const runNpmCommand = async (args: string[]): Promise<number> => {
    return new Promise((resolve, reject) => {
        const cmdLine = "$npm_execpath " + args.join(" ");
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


const isNPM = (): boolean => {
    return process.env.npm_execpath?.includes('npm') ?? false;
}

const isYARN = (): boolean => {
    return process.env.npm_execpath?.includes('yarn') ?? false;
}