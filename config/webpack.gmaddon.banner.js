'use strict';

const ConcatSource = require('webpack-sources').ConcatSource;
const fs = require('fs');
const path = require('path');


class GMAddonBannerPlugin {
    constructor(options) {
        if (arguments.length > 1)
            throw new Error('GMAddonBannerPlugin only takes one argument (pass an options object)');
        this.options = options || {};
    }


    apply(compiler) {
        compiler.hooks.compilation.tap('GMAddonBannerPlugin', compilation => {
            compilation.hooks.afterOptimizeChunkAssets.tap('GMAddonBannerPlugin', (chunks) => {
                chunks.forEach(chunk => {
                    chunk.files.forEach((file) => {
                        let filename = file.replace(/\?.*/, "");

                        this.updateDownloadURL(filename);
                        let banner = this.generateMetaBlock(filename);

                        if (this.options.downloadURL) {
                            const outname = compilation.outputOptions.path + "/" + filename.replace(".user.", ".meta.");
                            fs.mkdirSync(path.dirname(outname), { recursive: true });

                            const withoutIcon = banner.replace(/^\/\/\s+@icon64.+\n/m, "")
                            fs.writeFileSync(outname, withoutIcon);
                        }

                        const extra = this.options.banner || "";
                        return compilation.assets[file] = new ConcatSource(extra, '\n', banner, '\n', compilation.assets[file]);
                    });
                });
            });
        });
    }


    updateDownloadURL(filename) {
        if (!this.options.downloadURL) return;

        const regex = new RegExp("/" + filename + "$");
        const path = this.options.downloadURL.replace(regex, "").replace(/\/$/, "");
        this.options.downloadURL = path + "/" + filename;
        this.options.updateURL = path + "/" + filename.replace(".user.", ".meta.");
    }


    generateMetaBlock() {
        const options = this.options;
        const std_entries = ['name', 'id', 'category', 'version', 'namespace', 'updateURL', 'downloadURL', 'description', 'match', 'include', 'grant', 'run-at'];
        const ignore = ['banner'];

        var entries = [];
        std_entries.forEach((cat) => {
            if (options[cat]) {
                this.createMetaEntry(entries, cat, options[cat]);
            }
        });

        for (let cat in options) {
            if (std_entries.indexOf(cat) === -1 && ignore.indexOf(cat) === -1) {
                this.createMetaEntry(entries, cat, options[cat]);
            }
        }

        return '// ==UserScript==\n' + entries.join('\n') + '\n// ==/UserScript==';
    }


    createMetaEntry(entries, name, value) {
        if (typeof (value) == 'function') {
            value = value();
        }

        let key = ('// @' + name + ' '.repeat(16)).substr(0, 20);

        if (Array.isArray(value)) {
            value.forEach((val) => { entries.push(key + val); });
        } else {
            entries.push(key + value);
        }
    }

}

module.exports = GMAddonBannerPlugin;
