import * as Plugin from "iitcpluginkit";


class <classname> implements Plugin.Class {

    init() {
        console.log("<classname> " + VERSION);

        <css>// eslint-disable-next-line @typescript-eslint/no-require-imports
            require("./styles.css"); </css>

        // FILL ME
    }

}

/**
 * use "main" to access you main class from everywhere
 * (same as window.plugin.<classname>)
 */
export const main = new <classname>();
Plugin.Register(main, "<classname>");
