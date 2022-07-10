/*
*   Usage example:

    import * as Plugin from "../plugin";

    class myPlugin implements Plugin.Class {
        init() {
            console.log("Hello World!");
        }
    }

    Plugin.Register(new myPlugin(), "myPlugin");
*/
/// <reference path="../types/index.d.ts" />

interface PluginInfo {
    script: {
        version: string,
        name: string
    };
}

export interface Class {
    init(): void;
}


export function Register(plugin: Class, name: string) {

    const setup = () => {
        window.plugin[name] = plugin;
        window.plugin[name].init();
    };

    setup.info = SCRIPT_INFO;

    if (!window.bootPlugins) { window.bootPlugins = []; }
    window.bootPlugins.push(setup);

    if (window.iitcLoaded) {
        setup();
    }
}
