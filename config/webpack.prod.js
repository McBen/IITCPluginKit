const { merge } = require('webpack-merge');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

process.env.NODE_ENV = 'production';


const commonConfig = require('./webpack.common.js');
let develConfig = merge(commonConfig, {

    output: {
        filename: `${global.config.id || "myplugin"}.user.js`,
        path: path.resolve(process.cwd(), 'dist'),
        publicPath: ""
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
        minimize: true,
        minimizer: [
            !!global.config.minimize ?
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true
                        }
                    }
                }) :
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            pure_funcs: [
                                "console.log", "console.assert", "console.debug", "console.info",
                                "console.time", "console.timeEnd", "console.timeLog"
                            ]
                        },
                        mangle: false,
                        keep_classnames: true,
                        keep_fnames: true,
                        format: {
                            beautify: true
                        }
                    }
                })
        ]
    }
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
