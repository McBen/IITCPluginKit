const { merge } = require('webpack-merge');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const commonConfig = require('./webpack.common.js');
let develConfig = merge(commonConfig, {

    mode: 'production',

    output: {
        filename: `${global.config.id || "myplugin"}.user.js`,
        path: path.resolve(process.cwd(), 'dist')
    },

    plugins: [],

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                enforce: 'pre',
                exclude: /(node_modules|\.spec\.js)/,
                use: [{
                    loader: 'webpack-strip-block',
                    options: {
                        start: 'DEBUG-START',
                        end: 'DEBUG-END'
                    }
                }]
            },
        ]
    },

    optimization: {
        minimize: !!global.config.minimize,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            })
        ]
    }
});


try {
    let userConfig = require(path.resolve(process.cwd(), 'webpack.config.js'));
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
