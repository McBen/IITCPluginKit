/**
 * @class Options
 * Manage localstorage saved options.
 *
 * @example usage
 *  export const enum GLOPT {
 *          setting1 = "set1",
 *          setting1 = "set2"
 *     }
 *
 *  export const myOption = new Options<GLOPT>("myplugin");
 *
 */
export class Options {
    /**
     * @param key the identifier used in localstorage
     * @param defaults [optional] default values, values used if option is not stored
     */
    constructor(key, defaults) {
        this.data = {};
        this.default = {};
        this.key = key;
        if (defaults)
            this.default = defaults;
        this.load();
    }
    /**
     * Get option
     * @return value, if not set default value, if also not set undefined
     */
    get(item) {
        return this.data[item] || this.default[item];
    }
    /**
     * Get option with Fallback/default value
     * @returns value | fallback value
     */
    getSafe(item, fallback) {
        const data = this.data[item];
        return data !== undefined ? data : fallback;
    }
    set(item, data) {
        if (this.data[item] === data)
            return;
        this.data[item] = (data === this.default[item] ? undefined : data);
        this.data[item] = data;
        this.save();
    }
    remove(item) {
        this.data[item] = undefined;
        this.save();
    }
    load() {
        this.data = {};
        const djson = window.localStorage.getItem(this.key);
        if (djson) {
            this.data = JSON.parse(djson);
        }
    }
    save() {
        window.localStorage.setItem(this.key, JSON.stringify(this.data));
    }
}
