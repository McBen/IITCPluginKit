import fs from "node:fs";
import { readConfig } from "./Read";
import { UserOptions } from "../UserOptions";


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

