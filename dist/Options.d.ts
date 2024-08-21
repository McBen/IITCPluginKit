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
export declare class Options<OT extends string> {
    private key;
    private data;
    private default;
    /**
     * @param key the identifier used in localstorage
     * @param defaults [optional] default values, values used if option is not stored
     */
    constructor(key: string, defaults?: {
        [key: string]: any;
    });
    /**
     * Get option
     * @return value, if not set default value, if also not set undefined
     */
    get<T>(item: OT): T | undefined;
    /**
     * Get option with Fallback/default value
     * @returns value | fallback value
     */
    getSafe<T>(item: OT, fallback: T): T;
    set<T>(item: OT, data: T): void;
    remove(item: OT): void;
    private load;
    private save;
}
