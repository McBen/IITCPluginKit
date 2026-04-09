import { getConfigVersion, isCurrentVersion, readPluginConfig, updateConfigVersion } from "../ConfigFiles/Plugin";
import { updateTSconfigV6 } from "../ConfigFiles/TsConfig";

export const commandMigrate = () => {

    if (isCurrentVersion()) {
        console.log("Your plugin config is already up to date. No migration needed.");
    } else {
        migrate();
    }
};

export const migrate = () => {

    const config = readPluginConfig();
    const version = getConfigVersion(config);

    // v1.10
    if (version < 1010000) {
        console.log("Migrating plugin config to version 1.10.0...");
        updateTSconfigV6();
    }


    updateConfigVersion(config);
}