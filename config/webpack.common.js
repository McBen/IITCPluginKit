const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const gmbanner = require('./webpack.gmaddon.banner');
const WrapperPlugin = require('./wrapper-webpack-plugin');
const { gitDescribeSync } = require('git-describe');



const config = readConfig('./plugin.json');
global.config = config;


function readConfig(filename) {
    const rawdata = fs.readFileSync(filename);
    return JSON.parse(rawdata);
}

global.getGitTag = function () {
    let version = 'v0.0.0';
    try {
        const git = gitDescribeSync('.');
        if (git.tag) version = git.tag;
    } catch (_) { };

    return version;
}

global.versionString = global.versionString || function () {
    return config.version || getGitTag();
}

global.versionStringScript = global.versionStringScript || function () {
    const version = config.version || getGitTag();
    return version.replace(/^v/, "");
}


const SCRIPT_HEADER = 'function wrapper(SCRIPT_INFO) {\n';
const SCRIPT_FOOTER = `
};
(function () {
  const info = {};
  if (typeof GM_info !== 'undefined' && GM_info && GM_info.script)
    info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
  if (typeof unsafeWindow != 'undefined' || typeof GM_info == 'undefined' || GM_info.scriptHandler != 'Tampermonkey') {
    const script = document.createElement('script');
    script.appendChild(document.createTextNode( '('+ wrapper +')('+JSON.stringify(info)+');'));
    document.head.appendChild(script);} 
  else wrapper(info);
})();`;

const image = 'https://github.com/McBen/IITCPluginKit/raw/assets/icon.png';
const icon64 = typeof config.icon !== "undefined" ? (config.icon ? config.icon : undefined) : image;


module.exports = {
    entry: './' + config.entry,
    mode: process.env.NODE_ENV,

    watchOptions: {
        poll: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.p?css$/,
                use: ['style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    {
                        loader: 'postcss-loader', options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, 'postcss.config.js'),
                            }
                        }
                    },

                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: 'asset/inline'
            },
            {
                test: /\.svg$/,
                use: [
                    { loader: 'svg-url-loader', options: { noquotes: true } }, // NB: not working in css
                    { loader: 'svgo-loader' },
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },

    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(versionString())
        }),
        new WrapperPlugin({
            header: SCRIPT_HEADER,
            footer: SCRIPT_FOOTER,
            afterOptimizations: true
        }),
        new gmbanner(
            {
                name: config.name || 'MyPlugin',
                id: config.id,
                category: config.category || 'Misc',
                version: versionStringScript,
                namespace: 'https://github.com/IITC-CE/ingress-intel-total-conversion',
                // namespace: 'https://github.com/jonatkins/ingress-intel-total-conversion',
                downloadURL: config.downloadURL,
                description: config.description,
                author: config.author,
                match: ['https://intel.ingress.com/*'],
                icon64: icon64,
                changelog: process.env.NODE_ENV === 'production' ? config.changelog : ""
            })
    ]
};
