import prompts from "prompts";
import path from "node:path";
import { readPackageJSON } from "./ConfigFiles/Package";
import { readPluginConfig } from "./ConfigFiles/Plugin";

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
