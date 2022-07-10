export { };

declare global {
    const script_info: any;
    const iitcBuildDate: string;

    // CONFIG OPTIONS ////////////////////////////////////////////////////
    /**
     * = 30
     * refresh view every 30s (base time)
     */
    var REFRESH: number;

    /**
     * = 5
     * add 5 seconds per zoom level
     */
    var ZOOM_LEVEL_ADJ: number;

    /**
     * = 2.5
     * refresh time to use after a movement event
     */
    var ON_MOVE_REFRESH: number;

    /**
     * = 10
     * limit on refresh time since previous refresh, limiting repeated move refresh rate
     */
    var MINIMUM_OVERRIDE_REFRESH: number;

    /**
     * = 15 * 60;
     * refresh game score every 15 minutes
     */
    var REFRESH_GAME_SCORE: number;

    /**
     * = 15 * 60
     * stop updating map after 15min idling
     */
    var MAX_IDLE_TIME: number;

    /**
     * = 20
     */
    var HIDDEN_SCROLLBAR_ASSUMED_WIDTH: number;

    /**
     * = 300
     */
    var SIDEBAR_WIDTH: number;

    /**
     *  how many pixels to the top before requesting new data
     */
    var CHAT_REQUEST_SCROLL_TOP: number; /** @default = 200; */
    var CHAT_SHRINKED: number; /** @default = 60; */

    /**
     * Minimum area to zoom ratio that field MU's will display
     * = 0.001
     */
    var FIELD_MU_DISPLAY_AREA_ZOOM_RATIO: number;

    /**
     * Point tolerance for displaying MU's
     * = 60
     */
    var FIELD_MU_DISPLAY_POINT_TOLERANCE: number;

    var COLOR_SELECTED_PORTAL: string; /** @default '#f0f' */

    /**
     * Team colors
     * @default ['#FF6600','#0088FF','#03DC03']
     */
    var COLORS: [string, string, string];
    var COLORS_LVL: string[]; /** @default ['#000',...,'#9627F4'] */
    var COLORS_MOD: {}; /** @default {VERY_RARE:'#b08cff',RARE:'#73a8ff',COMMON:'#8cffbf'} */

    var MOD_TYPE: {}; // { RES_SHIELD: 'Shield', MULTIHACK: 'Multi-hack', FORCE_AMP: 'Force Amp', HEATSINK: 'Heat Sink', TURRET: 'Turret', LINK_AMPLIFIER: 'Link Amp' };

    /**
     * circles around a selected portal that show from where you can hack
     * it and how far the portal reaches (i.e. how far links may be made
     * from this portal)
     */
    var ACCESS_INDICATOR_COLOR: string; // = 'orange';
    var RANGE_INDICATOR_COLOR: string; // = 'red'

    /**
     * min zoom for intel map - should match that used by stock intel
     */
    var MIN_ZOOM: number; // = 3;

    /**
     * used when zoom level is not specified explicitly (must contain all the portals)
     */
    var DEFAULT_ZOOM: number; // = 15;

    var DEFAULT_PORTAL_IMG: string; // '//commondatastorage.googleapis.com/ingress.com/img/default-portal-image.png';
    var NOMINATIM: string; // '//nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=';

    // INGRESS CONSTANTS /////////////////////////////////////////////////
    // http://decodeingress.me/2012/11/18/ingress-portal-levels-and-link-range/
    var RESO_NRG: number[]; /** @default [0,1000,1500,2000,2500,3000,4000,5000,6000] */
    var HACK_RANGE: number; /** @default 40 in meters, max. distance from portal to be able to access it */
    var OCTANTS: string[]; /** @default ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE'] */
    var OCTANTS_ARROW: string[]; /** @default ['→', '↗', '↑', '↖', '←', '↙', '↓', '↘'] */
    var DESTROY_RESONATOR: number; /** @default 75 AP for destroying portal */
    var DESTROY_LINK: number; /** @default 187  AP for destroying link */
    var DESTROY_FIELD: number; /** @default 750 AP for destroying field */
    var CAPTURE_PORTAL: number; /** @default 500 AP for capturing a portal */
    var DEPLOY_RESONATOR: number; /** @default 125 AP for deploying a resonator */
    var COMPLETION_BONUS: number; /** @default 250; AP for deploying all resonators on portal */
    var UPGRADE_ANOTHERS_RESONATOR: number; /** @default 65; AP for upgrading another's resonator */
    var MAX_PORTAL_LEVEL: number; /** @default 8 */
    var MAX_RESO_PER_PLAYER: number[]; /** @default [0, 8, 4, 4, 4, 2, 2, 1, 1] */

    // OTHER MORE-OR-LESS CONSTANTS //////////////////////////////////////
    /** Team constants */
    var TEAM_ENL: number; /** @default 2 */
    var TEAM_RES: number; /** @default 1 */
    var TEAM_NONE: number; /** @default 0 */

    /** Team CSS = ['none', 'res', 'enl'] */
    var TEAM_TO_CSS: [string, string, string];

    /** ['Neutral', 'Resistance', 'Enlightened'] */
    var TEAM_NAMES: [string, string, string];

    // STORAGE ///////////////////////////////////////////////////////////
    // global constiables used for storage. Most likely READ ONLY. Proper
    // way would be to encapsulate them in an anonymous function and write
    // getters/setters, but if you are careful enough, this works.
    var refreshTimeout: any; // = undefined;
    var urlPortal: any; // = null;
    var urlPortalLL: any; // = null;

    /** guid of current selected portal */
    var selectedPortal: PortalGUID | null;

    var portalRangeIndicator: any; // = null;
    var portalAccessIndicator: any; // = null;
    var mapRunsUserAction: any; // = false;

    var portalsFactionLayers: L.LayerGroup;
    var linksFactionLayers: L.LayerGroup;
    var fieldsFactionLayers: L.LayerGroup;

    /** list of all loaded portals */
    var portals: { [guid: string /* PortalGUID */]: IITC.Portal };

    /** list of all loaded links */
    var links: { [guid: string /* LinkGUID */]: IITC.Link };

    /** list of all fields */
    var fields: { [guid: string /* FieldGUID */]: IITC.Field };

    /**
     * contain current status(on/off) of overlay layerGroups.
     * But you should use isLayerGroupDisplayed(name) to check the status
     */
    var overlayStatus: {};
}
