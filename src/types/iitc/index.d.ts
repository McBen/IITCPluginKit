/// <reference path="./types.d.ts" />
/// <reference path="./android.d.ts" />
/// <reference path="./artifact.d.ts" />
/// <reference path="./boot.d.ts" />
/// <reference path="./chat.d.ts" />
/// <reference path="./dialog.d.ts" />
/// <reference path="./constants.d.ts" />
/// <reference path="./data_cache.d.ts" />
/// <reference path="./entity_decode.d.ts" />
/// <reference path="./entity_info.d.ts" />
/// <reference path="./extract_niantic_parameters.d.ts" />
/// <reference path="./hooks.d.ts" />
/// <reference path="./idle.d.ts" />
/// <reference path="./intel_entity.d.ts" />
/// <reference path="./intel_chat.d.ts" />
/// <reference path="./intel_player.d.ts" />
/// <reference path="./map_data_render.d.ts" />
/// <reference path="./map_data_debug.d.ts" />
/// <reference path="./map_data_calc_tools.d.ts" />
/// <reference path="./map_data_request.d.ts" />
/// <reference path="./game_status.d.ts" />
/// <reference path="./utils_misc.d.ts" />
/// <reference path="./layerchooser.d.ts" />
/// <reference path="./ornaments.d.ts" />
/// <reference path="./panes.d.ts" />
/// <reference path="./player_names.d.ts" />
/// <reference path="./portal_data.d.ts" />
/// <reference path="./portal_detail_display_tools.d.ts" />
/// <reference path="./portal_detail_display.d.ts" />
/// <reference path="./portal_hightlighter.d.ts" />
/// <reference path="./portal_info.d.ts" />
/// <reference path="./portal_marker.d.ts" />
/// <reference path="./redeeming.d.ts" />
/// <reference path="./region_scoreboard.d.ts" />
/// <reference path="./request_handling.d.ts" />
/// <reference path="./search.d.ts" />
/// <reference path="./send_request.d.ts" />
/// <reference path="./smartphone.d.ts" />
/// <reference path="./utils_file.d.ts" />


/**
 * @module IITC
 */


interface PortalDetail {
    /** Get portal detail from cache */
    get(guid: string): IITC.PortalDataDetail | undefined;

    /** Get portal detail from cache */
    isFresh(guid: string): boolean | undefined;

    /** Request Portal details from server
     *  NB: you shouldn't use it.
     */
    request(guid: string): jQuery.Promise;
}



interface Window {

    /* #region Variables  */
    /** All iitc Pluigns */
    plugin: any;

    /** iitc-Pluigns setup/initialize function */
    bootPlugins: BootCallback[];

    /** if true iitc main script was already loaded (plugin need to trigger setup on iths own) */
    iitcLoaded: boolean;

    /** the Leaflet Map */
    map: L.Map;

    /** guid of current selected portal */
    selectedPortal: PortalGUID | null;

    /** list of all loaded portals */
    portals: { [guid: string /* PortalGUID */]: IITC.Portal };

    /** list of all loaded links */
    links: { [guid: string /* LinkGUID */]: IITC.Link };

    /** list of all fields */
    fields: { [guid: string /* FieldGUID */]: IITC.Field };

    /** google-api */
    gapi: any;

    /** failed data requests calls */
    failedRequestCount: number;

    /** Layer visibilty control */
    layerChooser: L.Control.Layers;

    /** Request handler */
    mapDataRequest: MapDataRequest;
    DEFAULT_MAX_IDLE_TIME: number;
    DEFAULT_REFRESH: number;
    MAX_IDLE_TIME: number;
    REFRESH: number;

    portalDetail: PortalDetail;

    /* #endregion */

    startRefreshTimeout(): void;

    /** Get Links of portal */
    getPortalLinks(guid: PortalGUID): { in: LinkGUID[]; out: LinkGUID[]; };

    /** Get Fields of portal */
    getPortalFields(guid: PortalGUID): FieldGUID[];


    /* #region  Portal Viewing */

    /** Make sure Portal is visible in Window */
    zoomToAndShowPortal(guid: PortalGUID, position: L.LatLng): void;

    /* #endregion */

    /** Create Portal-Marker */
    createMarker(position: L.LatLng, options: IITC.PortalOptions): L.CircleMarker;


    // Map Stuff
    getMapZoomTileParameters(dataZoom: number): IITC.TileParameters;
    getDataZoomForMapZoom(mapZoom: number): number;
    selectPortalByLatLng(lat: number, lng: number): void;
    lngToTile(longitude: number, params: IITC.TileParameters): number;
    latToTile(latitude: number, params: IITC.TileParameters): number;
    tileToLng(x: number, params: IITC.TileParameters): number;
    tileToLat(y: number, params: IITC.TileParameters): number;
    pointToTileId(params: IITC.TileParameters, x: number, y: number): TileID;

    /* #region  Helper */
    /** add Layergroup to leaflets layer-chooser */
    addLayerGroup(name: string, layer: L.LayerGroup<any>, defaultVisibile: boolean, groupname?: string): void;

    /** remove a layer */
    removeLayerGroup(layer: L.LayerGroup<any>): void;

    /** get layer visiblity */
    isLayerGroupDisplayed(name: string, defaultDisplay?: boolean): boolean;

    /** set layer visiblity */
    updateDisplayedLayerGroup(name: string, display: boolean): void;

    /** escape Html string */
    escapeHtmlSpecialChars(name: string): string;

    /** find guid by position E6*/
    findPortalGuidByPositionE6(latE6: number, lngE6: number): string;

    /** prepare marker for OverlappingMarkerSpiderfier */
    registerMarkerForOMS(marker: L.Marker): void;

    /** convert time to string */
    unixTimeToDateTimeString(ticks: Date): string;

    /** format time difference */
    formatInterval(seconds: number, maxTerms?: number): string;

    /** convert time to string hhmm */
    unixTimeToHHmm(ticks: number): string;

    /** convert team string to id */
    teamStringToId(team: string): number;

    /* #endregion */

    // IE
    MSStream: any;
}

type BootCallback = () => void;


declare function load(name: string): any;

declare const PLAYER: Intel.PlayerInfo;

