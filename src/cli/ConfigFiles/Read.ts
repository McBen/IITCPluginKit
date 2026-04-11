import fs from "node:fs";

export const readConfig = <T = Record<string, any>>(filename: string): T => {
    let rawdata: Buffer;
    try {
        rawdata = fs.readFileSync(filename);
    } catch {
        return {} as T;
    }

    return JSON.parse(rawdata.toString()) as T;
}

