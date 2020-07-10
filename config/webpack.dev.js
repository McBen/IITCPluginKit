const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const dateFormat = require('dateformat');
const { gitDescribeSync } = require('git-describe');


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

const CommonConfig = require('./webpack.common.js');


module.exports = merge(CommonConfig, {

    mode: 'development',

    output: {
        filename: `${global.config.id || "myplugin"}.dev.user.js`,
        path: path.resolve(__dirname, '../../../dist'),
        devtoolModuleFilenameTemplate: `webpack://[namespace]/${global.config.id || "myplugin"}/[resource-path]?[loaders]`
    },

});
