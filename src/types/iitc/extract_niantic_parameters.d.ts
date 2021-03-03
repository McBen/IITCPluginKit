export { };

declare global {
    /**
     * as of 2014-08-14, Niantic have returned to minifying the javascript. This means we no longer get the nemesis object
     * and it's various member objects, functions, etc.
     * so we need to extract some essential parameters from the code for IITC to use
     */
    function extractFromStock(): void;
}

declare namespace niantic_params {
    const CURRENT_VERSION: string;
    const ZOOM_TO_LEVEL: number[];
    const TILES_PER_EDGE: number[];
}
