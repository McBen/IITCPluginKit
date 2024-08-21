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
export class Options<OT extends string> {

    private key: string;
    private data: { [key: string]: any } = {};
    private default: { [key: string]: any } = {};

    /**
     * @param key the identifier used in localstorage
     * @param defaults [optional] default values, values used if option is not stored
     */
    constructor(key: string, defaults?: { [key: string]: any }) {
        this.key = key;
        if (defaults) this.default = defaults;

        this.load();
    }

    /**
     * Get option
     * @return value, if not set default value, if also not set undefined
     */
    get<T>(item: OT): T | undefined {
        return this.data[item] || this.default[item];
    }


    /**
     * Get option with Fallback/default value
     * @returns value | fallback value
     */
    getSafe<T>(item: OT, fallback: T): T {
        const data = <T | undefined>this.data[item];
        return data !== undefined ? data : fallback;
    }


    set<T>(item: OT, data: T): void {
        if (this.data[item] === data) return;

        this.data[item] = (data === this.default[item] ? undefined : data);

        this.data[item] = data;
        this.save();
    }

    remove(item: OT): void {
        this.data[item] = undefined;
        this.save();
    }

    private load(): void {
        this.data = {};
        const djson = window.localStorage.getItem(this.key);
        if (djson) {
            this.data = JSON.parse(djson);
        }
    }

    private save(): void {
        window.localStorage.setItem(this.key, JSON.stringify(this.data));
    }
}
