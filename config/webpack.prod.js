const Merge = require('webpack-merge');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const CommonConfig = require('./webpack.common.js');


module.exports = Merge(CommonConfig, {

    mode: 'production',

    output: {
        filename: `${global.config.id || "myplugin"}.user.js`,
        path: path.resolve(__dirname, '../../../dist')
    },

    plugins: [
    ],

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


