'use strict';

const ConcatSource = require('webpack-sources').ConcatSource;
const Compilation = require('webpack/lib/Compilation');
const fs = require('fs');
const path = require('path');

/**
 * Options are
 *  - regular GM_Metadata options
 *  - "banner": text will be added on top of the file (before meta block)
 *  - "changelog": filename of text file which will be added on top (after te meta block)
 *  - "icon64": has set a default image (clear it if you don't want it)
 */


class GMAddonBannerPlugin {
    constructor(options) {
        if (arguments.length > 1)
            throw new Error('GMAddonBannerPlugin only takes one argument (pass an options object)');
        this.options = options || {};
    }


    apply(compiler) {

        const plugin = {
            name: this.constructor.name,
            stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
        };


        compiler.hooks.compilation.tap(plugin, compilation => {
            compilation.hooks.processAssets.tap(plugin,
                () => {
                    compilation.chunks.forEach(chunk => {
                        chunk.files.forEach((file) => {
                            const filename = file.replace(/\?.*/, "");

                            this.updateDownloadURL(filename);

                            if (this.options.downloadURL) {
                                const metaBlock = this.generateMetaBlock(false);
                                const outname = compilation.outputOptions.path + "/" + filename.replace(".user.", ".meta.");
                                fs.mkdirSync(path.dirname(outname), { recursive: true });
                                fs.writeFileSync(outname, metaBlock);
                            }

                            let banner = this.generateMetaBlock(true);
                            if (this.options.changelog) {
                                banner += this.getChangelog(this.options.changelog);
                            }
                            return compilation.assets[file] = new ConcatSource(banner, '\n', compilation.assets[file]);
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


    generateMetaBlock(fullDetails) {
        const options = this.options;
        const std_entries = ['name', 'id', 'category', 'version', 'namespace', 'updateURL', 'downloadURL', 'description', 'match', 'include', 'grant', 'run-at'];
        const ignore = ['banner', 'changelog'];
        if (!fullDetails) {
            ignore.push("icon64");
        }

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

        let extraBanner = "";
        if (fullDetails && this.options.banner) {
            extraBanner = this.options.banner + "\n";
        }

        return extraBanner + '// ==UserScript==\n' + entries.join('\n') + '\n// ==/UserScript==';
    }


    createMetaEntry(entries, name, value) {
        if (typeof (value) == 'function') {
            value = value();
        }
        if (typeof value === "undefined") return;

        let key = ('// @' + name + ' '.repeat(16)).slice(0, 20);

        if (Array.isArray(value)) {
            value.forEach((val) => { entries.push(key + val); });
        } else {
            entries.push(key + value);
        }
    }

  getChangelog(filename) {
    try {
      let changelog = fs.readFileSync(filename, "utf8");
      changelog = changelog.replace(/\r\n/g, "\n");
      changelog = changelog.replace(/\/\*/gm, "").replace(/\*\//gm, "");
      changelog = changelog.replace(/^/gm, " * ");
      return "\n\n/**\n" + changelog + "\n */";
    } catch (err) {
      console.error(err);
      return "";
    }
  }
}

module.exports = GMAddonBannerPlugin;
