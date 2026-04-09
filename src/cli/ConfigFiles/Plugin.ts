import fs from "node:fs";
import { readConfig } from "./Read";
import { UserOptions } from "../UserOptions";
import path from "node:path";
import { getIPKFolder } from "../Run";


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
    fileversion?: string;
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


export const getConfigVersion = (options: PluginConfig): number => {
    return versionToNumber(options.fileversion);
}


const getIPKConfigVersion = (): string | undefined => {
    const ipkPath = path.join(getIPKFolder(), "package.json");
    const ipkPackage = readConfig(ipkPath);
    return ipkPackage?.version as string;
}

export const updateConfigVersion = (pluginConfig: PluginConfig): void => {
    pluginConfig.fileversion = getIPKConfigVersion();
    fs.writeFileSync(PLUGIN_CONFIG, JSON.stringify(pluginConfig, undefined, 2));
}

export const isCurrentVersion = (): boolean => {
    const config = readPluginConfig();
    const version = getConfigVersion(config);
    const expcted = getIPKConfigVersion();
    return version === versionToNumber(expcted);
}

const versionToNumber = (version?: string): number => {
    const parts: number[] = version?.split(".").map(s => parseInt(s)) ?? [0, 0, 0];
    return parts[0] * 1000000 + parts[1] * 1000 + parts[2];
}