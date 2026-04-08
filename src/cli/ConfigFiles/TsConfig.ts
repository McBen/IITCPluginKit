import fs from "node:fs";
import path from "node:path";
import { readConfig } from "./Read";
import { UserOptions } from "../UserOptions";
import { getIPKFolder} from "../Run";


export const createTSconfig = (targetDiretory: string, options: UserOptions): void => {
    if (fs.existsSync("tsconfig.json")) return;

    const oldConfig = readConfig(targetDiretory + "/templates/tsconfig.json");
    oldConfig.files = [options.entry];
    fs.writeFileSync("tsconfig.json", JSON.stringify(oldConfig, undefined, 2));
}


export const updateTSconfig = (): void => {
    if (!fs.existsSync("tsconfig.json")) return;

    const oldConfig = readConfig("tsconfig.json");

    // already updated?
    if (!oldConfig.include && !oldConfig.types) return;

    oldConfig.include = undefined;
    oldConfig.types = undefined;
    oldConfig.module = "es2022";
    oldConfig.target = "es2022";
    oldConfig.moduleResolution = "bundler";
    oldConfig.typeRoots = [
        "./node_modules/@types",
        "./node_modules/iitcpluginkit/types",
    ];
    oldConfig.noImplicitReturns = undefined;
    oldConfig.noImplicitAny = undefined;
    oldConfig.noImplicitThis = undefined;
    oldConfig.alwaysStrict = undefined;
    oldConfig.strictNullChecks = undefined;
    oldConfig.strictFunctionTypes = undefined;
    oldConfig.noUnusedLocals = undefined;
    oldConfig.types = [
        "node",
        "jquery",
        "build_constances",
        "greasemonkey",
        "iitc",
        "jqueryui",
        "leaflet",
        "images",
        "node",
    ];

    fs.writeFileSync("tsconfig.json", JSON.stringify(oldConfig, undefined, 2));
}


export const createAdditionalFiles = (options: UserOptions): void => {
    // TODO: this array might contain other files...
    const files = new Map([
        ['readme.md', options.useReadme]
    ])
    const replacements = new Map([
        ['classname', options.classname],
        ['description', options.description],
    ])

    for (const [file, enabled] of files) {
        if (!enabled) continue;
        if (fs.existsSync(file)) continue;

        let contents = fs.readFileSync(path.join(getIPKFolder(), "templates", file), 'utf8');

        for (const [key, value] of replacements) {
            contents = contents.replaceAll(`{${key}}`, value);
        }

        fs.writeFileSync(file, contents);
    }
}

