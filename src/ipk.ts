#!/usr/bin/env node
import fs from "node:fs";
import { exit } from "node:process";
import { spawn } from "node:child_process";
import path from "node:path";
import prompts from "prompts";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";



// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
const commandInit = async (): Promise<void> => {

    const options = await getUserOptions().catch(() => {
        console.log("Aborted");
        exit();
    });

    fs.mkdirSync("src", { recursive: true });
    createPluginConfig(options);
    createTemplate(options);
    createTSconfig(getIPKFolder(), options);
    createAdditionalFiles(options);
    updatePackageJSON();

    if (options.changelog && !fs.existsSync("changelog.md"))
        fs.closeSync(fs.openSync("changelog.md", "w"));
    if (!fs.existsSync(".gitignore"))
        fs.copyFileSync(
            path.join(getIPKFolder(), "templates/gitignore"),
            ".gitignore",
            fs.constants.COPYFILE_EXCL,
        );

    if (options.eslint) {
        await addLinter(getIPKFolder());
    }
};


const createTemplate = (options: UserOptions): void =>  {
    if (fs.existsSync(options.entry)) return;

    let temporary = fs.readFileSync(path.join(getIPKFolder(), "templates/BaseTemplate.ts"), "utf8");

    if (options.css) {
        temporary = temporary.replace(/<css>/g, "");
        temporary = temporary.replace(/\s*<\/css>/g, "");
    } else {
        temporary = temporary.replace(/<css>[\s\S]*<\/css>/gm, "");
    }

    temporary = temporary.replace(/<classname>/g, options.classname);

    fs.writeFileSync(options.entry, temporary);

    if (options.css && !fs.existsSync("src/styles.css")) {
        fs.writeFileSync("src/styles.css", "");
    }
};


const commandBuildDEV = (argv: any): void => {
    const myargs = ["webpack", "--config", getIPKFolder() + "/config/webpack.dev.js"];
    if (argv.watch) myargs.push("--watch");
    void runScript(myargs);
};

const commandBuildPROD = (argv: any): void => {
    const myargs = ["webpack", "--config", getIPKFolder() + "/config/webpack.prod.js"];
    if (argv.watch) myargs.push("--watch");
    void runScript(myargs);
};

const commandServe = (): void => {
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

const commandAutobuild = (): void => {
    void runScript([
        "concurrently",
        "--kill-others",
        '"yarn build:dev --watch"',
        '"yarn start ' + process.argv.slice(3).join(" ") + '"',
    ]);
}


const commandMigrate = () => {
    const oldConfig = readPluginConfig();
    const version = oldConfig.iipk_version || "0.0.0";

    updateTSconfig();
};


// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
export const readConfig = <T = Record<string, any>>(filename: string): T => {
    let rawdata: Buffer;
    try {
        rawdata = fs.readFileSync(filename);
    } catch {
        return {} as T;
    }

    return JSON.parse(rawdata.toString()) as T;
}


// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
const PACKAGEFILE = "package.json";

export const readPackageJSON = (): Record<string, any> => {
    return readConfig(PACKAGEFILE);
}

export const addLinter = async (targetDirectory: string): Promise<void> => {
    if (fs.existsSync("eslint.config.js")) {
        fs.copyFileSync(
            "eslint.config.js",
            "eslint.config.js_bak",
            fs.constants.COPYFILE_FICLONE,
        );
    }
    fs.copyFileSync(
        path.join(targetDirectory, "/templates/eslint.config.js"),
        "eslint.config.js",
        fs.constants.COPYFILE_FICLONE,
    );

    const removeold = [
        "remove",
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
        "eslint",
        "eslint-plugin-import",
        "eslint-plugin-prefer-arrow",
        "eslint-plugin-unicorn",
    ];
    console.log("Removing old linter packages (if any)...");
    await runScript(removeold).catch(() => console.log("No old linter packages to remove."));

    const args = [
        "add",
        "-D",
        "@eslint/js",
        "eslint",
        "eslint-plugin-prefer-arrow-functions",
        "eslint-plugin-unicorn",
        "typescript-eslint",
    ];
    await runScript(args);

    const config = readConfig(PACKAGEFILE);
    if (!config.type) {
        config.type = "module";
        fs.writeFileSync(PACKAGEFILE, JSON.stringify(config, undefined, 2));
    }
}


export const updatePackageJSON = (): void => {
    const config = readConfig(PACKAGEFILE);
    config.license = config.license ?? "Unlicense";
    config.type = "module";

    config.scripts = config.scripts ?? {};
    config.scripts.build = "yarn build:dev";
    config.scripts["build:dev"] = "yarn ipk build:dev";
    config.scripts["build:prod"] = "yarn ipk build:prod";
    config.scripts.start = "yarn ipk fileserver";
    config.scripts.autobuild = "yarn ipk autobuild";

    fs.writeFileSync(PACKAGEFILE, JSON.stringify(config, undefined, 2));
}

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
const PLUGIN_CONFIG = "plugin.json";


export interface PluginConfig {
    name: string;
    id: string;
    version?: string;
    category: string;
    description: string;
    author: string;
    entry: string;
    downloadURL?: string;
    minimize: boolean;
    changelog: string;
    iipk_version?: string;
}


export const readPluginConfig = (): PluginConfig => {
    return readConfig(PLUGIN_CONFIG);
}


export const createPluginConfig = (options: UserOptions): void => {
    const pluginConfig: PluginConfig = {
        name: options.name,
        id: options.id,
        version: options.version,
        category: options.category,
        description: options.description,
        author: options.author,
        entry: options.entry,
        downloadURL: options.downloadURL,
        minimize: options.minimize,
        changelog: options.changelog ? "changelog.md" : "",
    };

    fs.writeFileSync(PLUGIN_CONFIG, JSON.stringify(pluginConfig, undefined, 2));
}



// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
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



// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
const getIPKFolder = (): string => {
    const rootdir = import.meta.resolve(`iitcpluginkit/package.json`);
    const dirname = path.dirname(rootdir);
    return dirname;
}


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


// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
export interface UserOptions {
    name: string;
    category: string;
    description: string;
    author: string;
    css: boolean;
    git: boolean;
    usechangelog: boolean;
    useReadme: boolean;
    eslint: boolean;
    entry: string;
    classname: string;
    id: string;
    minimize: boolean;
    version?: string;
    downloadURL?: string;
    changelog?: string;
}


export const getUserOptions = async (): Promise<UserOptions> => {
    const oldConfig = readPluginConfig();
    let oldEntry;
    if (oldConfig.entry) oldEntry = oldConfig.entry.replace(/^src\//, "");

    const packageConfig = readPackageJSON();

    const current_directory = path.basename(process.cwd());
    const folder_fixed_case = current_directory.replace(
        /[a-zA-Z]+/g,
        (x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase(),
    );

    const categories = [
        "Cache",
        "Controls",
        "Draw",
        "Highlighter",
        "Info",
        "Layer",
        "Map Tiles",
        "Portal Info",
        "Tweaks",
        "Misc",
    ].sort();

    const options = await prompts([
        { name: "name", type: "text", message: "Plugin name?", initial: oldConfig.name ?? packageConfig.name ?? folder_fixed_case },
        {
            name: "category", type: "autocomplete", message: "Category?",
            choices: categories.map((s) => ({ title: s })),
            initial: oldConfig.category || "Misc"
        },
        { name: "description", type: "text", message: "Description?", initial: oldConfig.description || packageConfig.description },
        { name: "author", type: "text", message: "Author?", initial: oldConfig.author || packageConfig.author },
        { name: "css", type: "toggle", message: "use CSS?", initial: true },
        { name: "git", type: "toggle", message: "use GIT tags for versioning?", initial: true },
        { name: "usechangelog", type: "toggle", message: "Include changelog?", initial: true },
        { name: 'useReadme', type: 'toggle', message: 'Include readme?', initial: true },
        { name: "eslint", type: "toggle", message: "use ESLint for CodeStyle checks?", initial: true },
        { name: "entry", type: "text", message: "Main file?", initial: oldEntry ?? "Main.ts" },
    ]) as UserOptions;

    if (!options.entry.startsWith("src/")) options.entry = "src/" + options.entry;
    if (!options.entry.endsWith(".ts")) options.entry += ".ts";


    options.name = options.name || "MyPlugin";
    const id = options.name.replace(/^iitc.?plugin[_:\s]+/i, "");
    options.classname = name2class(id);
    options.id = "iitc_plugin_" + name2class(id);
    options.name = "IITC plugin: " + id;
    options.minimize = oldConfig.minimize ?? false;


    if (!options.git) {
        options.version = oldConfig.version ?? packageConfig.version ?? "1.0.0";
    }

    return options;
}


const name2class = (name: string): string => {
    name = name.replace(/\s/g, "_");
    name = name.replace(/\W/g, "");
    return name;
}



// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
void yargs(hideBin(process.argv))
    .command(
        ["init", "*"],
        "create empty sceleton plugin (setup config files)",
        () => true,
        () => commandInit(),
    )
    .command(
        "init:linter",
        "add (or upgrade) ESLint",
        () => true,
        () => addLinter(getIPKFolder()),
    )
    .command(
        ["build:dev", "build"],
        "build debug plugin",
        () => true,
        (argv: any) => commandBuildDEV(argv),
    )
    .command(
        "build:prod",
        "build release plugin",
        () => true,
        (argv: any) => commandBuildPROD(argv),
    )
    .command(
        "fileserver",
        "run fileserver",
        () => true,
        () => commandServe(),
    )
    .command(
        "autobuild",
        "watch files and build",
        () => true,
        () => commandAutobuild(),
    )
    .command(
        ["migrate", "upgrade"],
        "update project file for current IITC Plugin Kit version",
        () => true,
        () => commandMigrate(),
    )
    .help("h")
    .alias("h", "help")
    .argv;
