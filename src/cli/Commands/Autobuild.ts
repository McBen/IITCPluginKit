import { runScript } from "../Run";

export const commandAutobuild = (): void => {
    void runScript([
        "concurrently",
        "--kill-others",
        '"yarn build:dev --watch"',
        '"yarn start ' + process.argv.slice(3).join(" ") + '"',
    ]);
}
