import fs from "node:fs";
import path from "node:path";
import { exit } from "node:process";
import { getIPKFolder} from "../Run";
import { getUserOptions, UserOptions } from "../UserOptions";
import { createPluginConfig } from "../ConfigFiles/Plugin";
import { createTSconfig, createAdditionalFiles} from "../ConfigFiles/TsConfig";
import { addLinter, updatePackageJSON } from "../ConfigFiles/Package";


export const commandInit = async (): Promise<void> => {

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
