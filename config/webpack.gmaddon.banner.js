'use strict';

const ConcatSource = require('webpack-sources').ConcatSource;



class GMAddonBannerPlugin {
    constructor(options) {
        if(arguments.length > 1)
            throw new Error('GMAddonBannerPlugin only takes one argument (pass an options object)');
        this.options = options || {};
    }


    apply(compiler) {
        compiler.hooks.compilation.tap('GMAddonBannerPlugin', compilation => {
            compilation.hooks.afterOptimizeChunkAssets.tap('GMAddonBannerPlugin', (chunks) => {
                chunks.forEach( chunk => {

                    let banner = this.generateMetaBlock();

                    chunk.files.forEach((file) => {
                        let basename;
                        let query = '';
                        let filename = file;
                        const hash = compilation.hash;
                        const querySplit = filename.indexOf('?');

                        if(querySplit >= 0) {
                            query = filename.substr(querySplit);
                            filename = filename.substr(0, querySplit);
                        }

                        if(filename.indexOf('/') < 0) {
                            basename = filename;
                        } else {
                            basename = filename.substr(filename.lastIndexOf('/') + 1);
                        }

                        const comment = compilation.getPath(banner, {
                            hash,
                            chunk,
                            filename,
                            basename,
                            query
                        });

                        return compilation.assets[file] = new ConcatSource(comment, '\n', compilation.assets[file]);
                    });
                });
            });
        });
    }


    generateMetaBlock() {
        const options = this.options;
        const std_entries=['name', 'category', 'version', 'namespace', 'updateURL', 'downloadURL', 'description','match', 'include', 'grant', 'run-at'];

        var entries=[];
        std_entries.forEach( (cat)=>{
            if (options[cat]) {
                this.createMetaEntry(entries,cat,options[cat]);
            }
        });

        for (let cat in options) {
            if (std_entries.indexOf(cat)==-1) {
                this.createMetaEntry(entries, cat, options[cat]);
            }
        }

        return '// ==UserScript==\n'+entries.join('\n')+'\n// ==/UserScript==';
    }


    createMetaEntry(entries, name, value) {
        if (typeof(value)=='function') {
            value = value();
        }

        let key = ('// @' + name + ' '.repeat(16)).substr(0,20);

        if (Array.isArray(value)) {
            value.forEach((val)=> { entries.push(key+val); });
        } else {
            entries.push(key+value);
        }
    }

}

module.exports = GMAddonBannerPlugin;
