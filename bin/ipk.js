#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const prompts = require('prompts');
const { exit } = require('process');
const { exec, spawn } = require('child_process');

const MYDIR = "./node_modules/iitcpluginkit";
const PLUGIN_CONFIG = "plugin.json";
const PACKAGEFILE = 'package.json';


require('yargs')
    .command(['init', '*'], 'create empty sceleton plugin (setup config files)', () => { }, () => commandInit())
    .command('init:linter', 'add (or upgrade) ESLint', () => { }, () => addLinter())
    .command(["build:dev", 'build'], 'build debug plugin', () => { }, (argv) => commandBuildDEV(argv))
    .command('build:prod', 'build release plugin', () => { }, (argv) => commandBuildPROD(argv))
    .command('fileserver', 'run fileserver', () => { }, () => commandServe())
    .command('autobuild', 'watch files and build', () => { }, () => commandAutobuild())
    .help('h')
    .alias('h', 'help')
    .argv;




async function commandInit() {

    const options = await getUserOptions().catch(() => { console.log("Aborted"); exit(); });

    fs.mkdirSync("src", { recursive: true });
    createPluginConf(options);
    createTemplate(options);
    createTSconfig(options);
    createAdditionalFiles(options);
    updatePackageJSON();

    if (options.changelog && !fs.existsSync("changelog.md")) fs.closeSync(fs.openSync("changelog.md", 'w'));
    if (!fs.existsSync(".gitignore")) fs.copyFileSync(MYDIR + "/bin/gitignore", ".gitignore", fs.constants.COPYFILE_EXCL);

    if (options.eslint) {
        addLinter();
    }
}


function readConfig(filename) {
    let rawdata
    try {
        rawdata = fs.readFileSync(filename);
    } catch (error) {
        return {};
    }

    return JSON.parse(rawdata);
}


async function getUserOptions() {
    const oldConf = readConfig(PLUGIN_CONFIG);
    let oldEntry;
    if (oldConf.entry) oldEntry = oldConf.entry.replace(/^src\//, "");

    const packageConf = readConfig(PACKAGEFILE);

    const current_directory = path.basename(process.cwd());
    const dir_fixed_case = current_directory.replace(/[a-zA-Z]+/g, x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())

    const categories = ["Cache", "Controls", "Draw", "Highlighter", "Info", "Layer", "Map Tiles", "Portal Info", "Tweaks", "Misc"].sort();

    const options = await prompts([
        { type: 'text', name: 'name', message: 'Plugin name?', initial: oldConf.name || packageConf.name || dir_fixed_case },
        {
            type: 'autocomplete', name: 'category', message: 'Category?', initial: oldConf.category || 'Misc',
            choices: categories.map(s => ({ title: s }))
        },
        { type: 'text', name: 'description', message: 'Description?', initial: oldConf.description || packageConf.description },
        { type: 'text', name: 'author', message: 'Author?', initial: oldConf.author || packageConf.author },
        { type: 'toggle', name: 'css', message: 'use CSS?', initial: true },
        { type: 'toggle', name: 'git', message: 'use GIT tags for versioning?', initial: true },
        { type: 'toggle', name: 'usechangelog', message: 'Include changelog?', initial: true },
        { type: 'toggle', name: 'useReadme', message: 'Include readme?', initial: true },
        { type: 'toggle', name: 'eslint', message: 'use ESLint for CodeStyle checks?', initial: true },
        { type: 'text', name: 'entry', message: 'Main file?', initial: oldEntry || "Main.ts" }
    ]);

    if (!options.entry.startsWith("src/")) options.entry = 'src/' + options.entry;
    if (!options.entry.endsWith(".ts")) options.entry += '.ts';

    options.name = options.name || "MyPlugin";
    const id = options.name.replace(/^iitc.?plugin[_:\s]+/i, "");
    options.classname = name2class(id);
    options.id = "iitc_plugin_" + name2class(id);
    options.name = "IITC plugin: " + id;
    options.minimize = oldConf.minimize || false

    if (!options.git) {
        options.version = oldConf.version || packageConf.version || "1.0.0";
    }

    return options
}

function createPluginConf(options) {
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
        changelog: options.changelog ? "changelog.md" : ""
    };

    fs.writeFileSync(PLUGIN_CONFIG, JSON.stringify(pluginConfig, null, 2));
}

function createTemplate(options) {
    if (fs.existsSync(options.entry)) return;

    let temp = fs.readFileSync(MYDIR + "/bin/BaseTemplate.ts", 'utf8');

    if (options.css) {
        temp = temp.replace(/<css>/g, "");
        temp = temp.replace(/\s*<\/css>/g, "");
    } else {
        temp = temp.replace(/<css>[\s\S]*<\/css>/gm, "");
    }

    temp = temp.replace(/<classname>/g, options.classname);

    fs.writeFileSync(options.entry, temp);

    if (options.css && !fs.existsSync("src/styles.css")) {
        fs.writeFileSync("src/styles.css", "");
    }
}

function createAdditionalFiles(options) {
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

        let contents = fs.readFileSync(`${MYDIR}/bin/${file}`, 'utf8');

        for (const [key, value] of replacements) {
            contents = contents.replaceAll(`{${key}}`, value);
        }

        fs.writeFileSync(file, contents);
    }
}

function createTSconfig(options) {
    if (fs.existsSync("tsconfig.json")) return;

    const oldConf = readConfig(MYDIR + "/bin/tsconfig.json");
    oldConf.files = [options.entry];
    fs.writeFileSync("tsconfig.json", JSON.stringify(oldConf, null, 2));
}


function name2class(name) {
    name = name.replace(/\s/g, "_");
    name = name.replace(/\W/g, "");
    return name;
}

function updatePackageJSON() {
    const conf = readConfig(PACKAGEFILE);
    conf["license"] = conf["license"] || "Unlicense";
    conf["type"] = "module";

    conf.scripts = conf.scripts || {}
    conf.scripts["build"] = "yarn build:dev";
    conf.scripts["build:dev"] = "yarn ipk build:dev";
    conf.scripts["build:prod"] = "yarn ipk build:prod";
    conf.scripts["start"] = "yarn ipk fileserver";
    conf.scripts["autobuild"] = "yarn ipk autobuild";

    fs.writeFileSync(PACKAGEFILE, JSON.stringify(conf, null, 2));
}

async function addLinter() {
    if (fs.existsSync("eslint.config.js")) {
        fs.copyFileSync("eslint.config.js", "eslint.config.js_bak", fs.constants.COPYFILE_FICLONE);
    }
    fs.copyFileSync(MYDIR + "/bin/eslint.config.js", "eslint.config.js", fs.constants.COPYFILE_FICLONE);

    const removeold = ["remove",
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
        "eslint",
        "eslint-plugin-import",
        "eslint-plugin-prefer-arrow",
        "eslint-plugin-unicorn"];
    await runScript(removeold);


    const args = ["add", "-D",
        "@eslint/js",
        "eslint",
        "eslint-plugin-prefer-arrow-functions",
        "eslint-plugin-unicorn",
        "typescript-eslint"
    ]
    await runScript(args);

    const conf = readConfig(PACKAGEFILE);
    if (!conf["type"]) {
        conf["type"] = "module";
        fs.writeFileSync(PACKAGEFILE, JSON.stringify(conf, null, 2));
    }
}


function commandBuildDEV(argv) {
    const myargs = ['webpack', "--config", MYDIR + "/config/webpack.dev.js"];
    if (argv.watch) myargs.push("--watch");
    runScript(myargs);
}

function commandBuildPROD(argv) {
    const myargs = ['webpack', "--config", MYDIR + "/config/webpack.prod.js"];
    if (argv.watch) myargs.push("--watch");
    runScript(myargs);
}

function commandServe() {
    const proc = spawn("node", [MYDIR + "/config/fileserver.js"].concat(process.argv.slice(3)), { stdio: 'inherit' })
    proc.on('error', function (err) {
        console.error(err);
    });
}

function commandAutobuild() {
    runScript(["concurrently", "--kill-others", "\"yarn build:dev --watch\"", "\"yarn start " + process.argv.slice(3).join(" ") + "\""]);
}


function runScript(args) {
    let cmd = 'yarn';
    const cmdLine = cmd + ' ' + args.join(' ');
    const proc = spawn(cmdLine, { stdio: 'inherit', shell: true })
    proc.on('error', function (err) {
        console.error(err);
    });
}
