/**
 * IITC Plugin Kit CLI entrypoint.
 *
 * This file configures the top-level command line interface for the
 * plugin kit toolset and delegates the actual work to command modules.
 * It is the CLI bootstrap that makes the commands available when
 * `ipk` is invoked from the terminal.
 */
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getIPKFolder } from "./cli/Run";
import { addLinter } from "./cli/ConfigFiles/Package";

import { commandInit } from "./cli/Commands/Init";
import { commandServe } from "./cli/Commands/Serve";
import { commandAutobuild } from "./cli/Commands/Autobuild";
import { commandMigrate } from "./cli/Commands/Migrate";
import { commandBuildDEV, commandBuildPROD } from "./cli/Commands/Build";


/**
 * Configure and execute the CLI.
 *
 * The yargs command definitions below expose each supported action and
 * map the command name to its implementation module.
 */
void yargs(hideBin(process.argv))
    .command(
        ["init", "*"],
        "create empty skeleton plugin (setup config files)",
        () => true,
        () => commandInit(),
    )
    .command(
        "init:linter",
        "add or upgrade ESLint configuration for the current project",
        () => true,
        () => addLinter(getIPKFolder()),
    )
    .command(
        ["build:dev", "build"],
        "build a development/debug plugin bundle",
        () => true,
        (argv: any) => commandBuildDEV(argv),
    )
    .command(
        "build:prod",
        "build a production-ready release plugin bundle",
        () => true,
        (argv: any) => commandBuildPROD(argv),
    )
    .command(
        "fileserver",
        "start a local file server for plugin development",
        () => true,
        () => commandServe(),
    )
    .command(
        "autobuild",
        "watch source files and rebuild automatically on changes",
        () => true,
        () => commandAutobuild(),
    )
    .command(
        ["migrate", "upgrade"],
        "upgrade project configuration to the current IITC Plugin Kit version",
        () => true,
        () => commandMigrate(),
    )
    .help("h")
    .alias("h", "help")
    .argv;
