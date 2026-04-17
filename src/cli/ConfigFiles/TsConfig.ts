import fs from "node:fs";
import path from "node:path";
import { readConfig } from "./Read";
import { UserOptions } from "../UserOptions";
import { getIPKFolder } from "../Run";


export const createTSconfig = (targetDiretory: string, options: UserOptions): void => {
    if (fs.existsSync("tsconfig.json")) return;

    const oldConfig = readConfig(targetDiretory + "/templates/tsconfig.json");
    oldConfig.files = [options.entry];
    fs.writeFileSync("tsconfig.json", JSON.stringify(oldConfig, undefined, 2));
}


export const updateTSconfigV6 = (): void => {
    if (!fs.existsSync("tsconfig.json")) return;

    const oldConfig = readConfig("tsconfig.json");

    // was wrong in old config
    oldConfig.include = undefined;
    oldConfig.types = undefined;


    oldConfig.compilerOptions = oldConfig.compilerOptions ?? {};
    // update module and target to es2022
    oldConfig.compilerOptions.module = "es2022";
    oldConfig.compilerOptions.target = "es2022";
    oldConfig.compilerOptions.moduleResolution = "bundler";
    oldConfig.compilerOptions.rootDir = "./src";

    // types must now be explicitly included
    oldConfig.compilerOptions.typeRoots = [
        "./node_modules/@types",
        "./node_modules/iitcpluginkit/types",
    ];
    oldConfig.compilerOptions.types = [
        "node",
        "jquery",
        "build_constances",
        "greasemonkey",
        "iitc",
        "jqueryui",
        "leaflet",
        "images"
    ];

    // strict options are true by default in ts 6, so we can just remove them
    if (oldConfig.compilerOptions.noImplicitReturns === true) delete oldConfig.compilerOptions.noImplicitReturns;
    if (oldConfig.compilerOptions.noImplicitAny === true) delete oldConfig.compilerOptions.noImplicitAny;
    if (oldConfig.compilerOptions.noImplicitThis === true) delete oldConfig.compilerOptions.noImplicitThis;
    if (oldConfig.compilerOptions.alwaysStrict === true) delete oldConfig.compilerOptions.alwaysStrict;
    if (oldConfig.compilerOptions.strictNullChecks === true) delete oldConfig.compilerOptions.strictNullChecks;
    if (oldConfig.compilerOptions.strictFunctionTypes === true) delete oldConfig.compilerOptions.strictFunctionTypes;
    if (oldConfig.compilerOptions.noUnusedLocals === true) delete oldConfig.compilerOptions.noUnusedLocals;

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

