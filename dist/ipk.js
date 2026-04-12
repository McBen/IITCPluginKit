#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { exit } from 'node:process';
import prompts from 'prompts';

/**
 * trying to keep all the os and npm/yarn specific code in one place
 */
/**
 * Gets the folder path where the iitcpluginkit package is located.
 * @returns The directory path of the iitcpluginkit package.
 */
const getIPKFolder = () => {
    const rootdir = import.meta.resolve(`iitcpluginkit/package.json`);
    // win32 have drive letter first; unix need root slash
    const dirname = path.dirname(rootdir).replace(/^file:\/*/, isWIN32() ? "" : "/");
    return dirname;
};
/**
 * Runs a script using npm_execpath with the provided arguments.
 * @param args - Array of string arguments to pass to the script.
 * @returns A promise that resolves to the exit code (0 for success).
 * @throws Error if the command fails (non-zero exit code).
 */
const runScript = async (args) => {
    return runNpmCommand(["run", ...args]);
};
const addPackage = async (packages, development = false) => {
    if (isYARN()) {
        return runNpmCommand([development ? "add -D" : "add", ...packages]);
    }
    else if (isNPM()) {
        return runNpmCommand([development ? "install -D" : "install", ...packages]);
    }
    else {
        throw new Error("Unsupported package manager. Only npm and yarn are supported.");
    }
};
const removePackage = async (packages) => {
    if (isYARN()) {
        return runNpmCommand(["remove", ...packages]);
    }
    else if (isNPM()) {
        return runNpmCommand(["uninstall", ...packages]);
    }
    else {
        throw new Error("Unsupported package manager. Only npm and yarn are supported.");
    }
};
const runNpmCommand = async (args) => {
    return new Promise((resolve, reject) => {
        const cmdLine = [isYARN() ? "yarn" : "npm", ...args].join(" ");
        const proc = spawn(cmdLine, { stdio: "inherit", shell: true });
        proc.on("close", code => {
            if (code === 0) {
                resolve(code);
            }
            else {
                reject(new Error(`command failed ${cmdLine}`));
            }
        });
    });
};
const isWIN32 = () => {
    return process.platform === "win32";
};
const isNPM = () => {
    return process.env.npm_execpath?.includes('npm') ?? false;
};
const isYARN = () => {
    return process.env.npm_execpath?.includes('yarn') ?? false;
};

const readConfig = (filename) => {
    let rawdata;
    try {
        rawdata = fs.readFileSync(filename);
    }
    catch {
        return {};
    }
    return JSON.parse(rawdata.toString());
};

const PACKAGEFILE = "package.json";
const readPackageJSON = () => {
    return readConfig(PACKAGEFILE);
};
const addLinter = async (targetDirectory) => {
    if (fs.existsSync("eslint.config.js")) {
        fs.copyFileSync("eslint.config.js", "eslint.config.js_bak", fs.constants.COPYFILE_FICLONE);
    }
    fs.copyFileSync(path.join(targetDirectory, "/templates/eslint.config.js"), "eslint.config.js", fs.constants.COPYFILE_FICLONE);
    const removeold = [
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
        "eslint",
        "eslint-plugin-import",
        "eslint-plugin-prefer-arrow",
        "eslint-plugin-unicorn",
    ];
    console.log("Removing old linter packages (if any)...");
    await removePackage(removeold).catch(() => console.log("No old linter packages to remove."));
    const args = [
        "@eslint/js",
        "eslint",
        "eslint-plugin-prefer-arrow-functions",
        "eslint-plugin-unicorn",
        "typescript-eslint",
    ];
    await addPackage(args, true);
    const config = readConfig(PACKAGEFILE);
    if (!config.type) {
        config.type = "module";
        fs.writeFileSync(PACKAGEFILE, JSON.stringify(config, undefined, 2));
    }
};
const updatePackageJSON = () => {
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
};

const PLUGIN_CONFIG = "plugin.json";
const readPluginConfig = () => {
    return readConfig(PLUGIN_CONFIG);
};
const createPluginConfig = (options) => {
    const pluginConfig = {
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
};
const getConfigVersion = (options) => {
    return versionToNumber(options.fileversion);
};
const getIPKConfigVersion = () => {
    const ipkPath = path.join(getIPKFolder(), "package.json");
    const ipkPackage = readConfig(ipkPath);
    return ipkPackage?.version;
};
const updateConfigVersion = (pluginConfig) => {
    pluginConfig.fileversion = getIPKConfigVersion();
    fs.writeFileSync(PLUGIN_CONFIG, JSON.stringify(pluginConfig, undefined, 2));
};
const isCurrentVersion = () => {
    const config = readPluginConfig();
    const version = getConfigVersion(config);
    const expcted = getIPKConfigVersion();
    return version === versionToNumber(expcted);
};
const versionToNumber = (version) => {
    const parts = version?.split(".").map(s => parseInt(s)) ?? [0, 0, 0];
    return parts[0] * 1000000 + parts[1] * 1000 + parts[2];
};

const getUserOptions = async () => {
    const oldConfig = readPluginConfig();
    let oldEntry;
    if (oldConfig.entry)
        oldEntry = oldConfig.entry.replace(/^src\//, "");
    const packageConfig = readPackageJSON();
    const current_directory = path.basename(process.cwd());
    const folder_fixed_case = current_directory.replace(/[a-zA-Z]+/g, (x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase());
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
    ]);
    if (!options.entry.startsWith("src/"))
        options.entry = "src/" + options.entry;
    if (!options.entry.endsWith(".ts"))
        options.entry += ".ts";
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
};
const name2class = (name) => {
    name = name.replace(/\s/g, "_");
    name = name.replace(/\W/g, "");
    return name;
};

const createTSconfig = (targetDiretory, options) => {
    if (fs.existsSync("tsconfig.json"))
        return;
    const oldConfig = readConfig(targetDiretory + "/templates/tsconfig.json");
    oldConfig.files = [options.entry];
    fs.writeFileSync("tsconfig.json", JSON.stringify(oldConfig, undefined, 2));
};
const updateTSconfigV6 = () => {
    if (!fs.existsSync("tsconfig.json"))
        return;
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
    oldConfig.compilerOptions.noImplicitReturns = oldConfig.compilerOptions.noImplicitReturns ? undefined : false;
    oldConfig.compilerOptions.noImplicitAny = oldConfig.compilerOptions.noImplicitAny ? undefined : false;
    oldConfig.compilerOptions.noImplicitThis = oldConfig.compilerOptions.noImplicitThis ? undefined : false;
    oldConfig.compilerOptions.alwaysStrict = oldConfig.compilerOptions.alwaysStrict ? undefined : false;
    oldConfig.compilerOptions.strictNullChecks = oldConfig.compilerOptions.strictNullChecks ? undefined : false;
    oldConfig.compilerOptions.strictFunctionTypes = oldConfig.compilerOptions.strictFunctionTypes ? undefined : false;
    oldConfig.compilerOptions.noUnusedLocals = oldConfig.compilerOptions.noUnusedLocals ? undefined : false;
    fs.writeFileSync("tsconfig.json", JSON.stringify(oldConfig, undefined, 2));
};
const createAdditionalFiles = (options) => {
    // TODO: this array might contain other files...
    const files = new Map([
        ['readme.md', options.useReadme]
    ]);
    const replacements = new Map([
        ['classname', options.classname],
        ['description', options.description],
    ]);
    for (const [file, enabled] of files) {
        if (!enabled)
            continue;
        if (fs.existsSync(file))
            continue;
        let contents = fs.readFileSync(path.join(getIPKFolder(), "templates", file), 'utf8');
        for (const [key, value] of replacements) {
            contents = contents.replaceAll(`{${key}}`, value);
        }
        fs.writeFileSync(file, contents);
    }
};

const commandInit = async () => {
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
        fs.copyFileSync(path.join(getIPKFolder(), "templates/gitignore"), ".gitignore", fs.constants.COPYFILE_EXCL);
    if (options.eslint) {
        await addLinter(getIPKFolder());
    }
};
const createTemplate = (options) => {
    if (fs.existsSync(options.entry))
        return;
    let temporary = fs.readFileSync(path.join(getIPKFolder(), "templates/BaseTemplate.ts"), "utf8");
    if (options.css) {
        temporary = temporary.replace(/<css>/g, "");
        temporary = temporary.replace(/\s*<\/css>/g, "");
    }
    else {
        temporary = temporary.replace(/<css>[\s\S]*<\/css>/gm, "");
    }
    temporary = temporary.replace(/<classname>/g, options.classname);
    fs.writeFileSync(options.entry, temporary);
    if (options.css && !fs.existsSync("src/styles.css")) {
        fs.writeFileSync("src/styles.css", "");
    }
};

const commandServe = () => {
    const scriptPath = path.join(getIPKFolder(), "/config/fileserver.js");
    const proc = spawn("node", [scriptPath, ...process.argv.slice(3)], { stdio: "inherit" });
    proc.on("error", (error) => {
        console.error(error);
    });
};

const commandAutobuild = () => {
    void runScript([
        "concurrently",
        "--kill-others",
        '"yarn build:dev --watch"',
        '"yarn start ' + process.argv.slice(3).join(" ") + '"',
    ]);
};

const commandMigrate = () => {
    if (isCurrentVersion()) {
        console.log("Your plugin config is already up to date. No migration needed.");
    }
    else {
        migrate();
    }
};
const migrate = () => {
    const config = readPluginConfig();
    const version = getConfigVersion(config);
    // v1.10
    if (version < 1010000) {
        console.log("Migrating plugin config to version 1.10.0...");
        updateTSconfigV6();
    }
    updateConfigVersion(config);
};

const commandBuildDEV = (argv) => {
    if (!isCurrentVersion())
        migrate();
    const myargs = ["webpack", "--config", getIPKFolder() + "/config/webpack.dev.js"];
    if (argv.watch)
        myargs.push("--watch");
    void runScript(myargs).catch(() => { });
};
const commandBuildPROD = (argv) => {
    if (!isCurrentVersion())
        migrate();
    const myargs = ["webpack", "--config", getIPKFolder() + "/config/webpack.prod.js"];
    if (argv.watch)
        myargs.push("--watch");
    void runScript(myargs);
};

/**
 * IITC Plugin Kit CLI entrypoint.
 *
 * This file configures the top-level command line interface for the
 * plugin kit toolset and delegates the actual work to command modules.
 * It is the CLI bootstrap that makes the commands available when
 * `ipk` is invoked from the terminal.
 */
/**
 * Configure and execute the CLI.
 *
 * The yargs command definitions below expose each supported action and
 * map the command name to its implementation module.
 */
void yargs(hideBin(process.argv))
    .command(["init", "*"], "create empty skeleton plugin (setup config files)", () => true, () => commandInit())
    .command("init:linter", "add or upgrade ESLint configuration for the current project", () => true, () => addLinter(getIPKFolder()))
    .command(["build:dev", "build"], "build a development/debug plugin bundle", () => true, (argv) => commandBuildDEV(argv))
    .command("build:prod", "build a production-ready release plugin bundle", () => true, (argv) => commandBuildPROD(argv))
    .command("fileserver", "start a local file server for plugin development", () => true, () => commandServe())
    .command("autobuild", "watch source files and rebuild automatically on changes", () => true, () => commandAutobuild())
    .command(["migrate", "upgrade"], "upgrade project configuration to the current IITC Plugin Kit version", () => true, () => commandMigrate())
    .help("h")
    .alias("h", "help")
    .argv;
