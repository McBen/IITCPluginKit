import fs from "node:fs";
import path from "node:path";
import { readConfig } from "./Read";
import { addPackage, removePackage } from "../Run";

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
