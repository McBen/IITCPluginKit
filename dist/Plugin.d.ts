import "../types/index.d.ts";
export interface PluginInfo {
    script: {
        version: string;
        name: string;
    };
}
export interface Class {
    init(): void;
}
export declare function Register(plugin: Class, name: string): void;
