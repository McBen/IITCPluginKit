const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const dateFormat = require('dateformat');
const { gitDescribeSync } = require('git-describe');

process.env.NODE_ENV = 'development';

// create special version strings
global.versionString = function () {
    let version = config.version || 'v0.0.0';
    try {
        const git = gitDescribeSync('.');
        if (git.semverString) {
            version = 'v' + git.semverString;
        }
    } catch (_) { };

    return version;
}

global.versionStringScript = function () {
    const version = config.version || getGitTag();
    let now = new Date();
    let str = version.replace(/^v/, "") + '.' + dateFormat(now, 'yymmdd.HHMMss');

    return str;
}


const commonConfig = require('./webpack.common.js');
let develConfig = merge(commonConfig, {

    output: {
        filename: `${global.config.id || "myplugin"}.dev.user.js`,
        path: path.resolve(process.cwd(), 'dist'),
        devtoolModuleFilenameTemplate: `webpack://[namespace]/${global.config.id || "myplugin"}/[resource-path]?[loaders]`,
        publicPath: ""
    },
});



try {
    let userConfig;
    ['webpack.config.cjs', 'webpack.config.js'].some(name => {
        const pname = path.resolve(process.cwd(), name);
        if (fs.existsSync(pname)) {
            userConfig = require(pname);
            return true;
        }
    })

    if (typeof userConfig === 'function') {
        userConfig(develConfig);
    } else {
        develConfig = merge(develConfig, userConfig);
    }
} catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
        console.log(error);
    }
}



module.exports = develConfig;
