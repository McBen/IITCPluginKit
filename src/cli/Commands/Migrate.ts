import { readPluginConfig } from "../ConfigFiles/Plugin";
import { updateTSconfig } from "../ConfigFiles/TsConfig";

export const commandMigrate = () => {
    const oldConfig = readPluginConfig();
    const version = oldConfig.iipk_version || "0.0.0";

    updateTSconfig();
};

