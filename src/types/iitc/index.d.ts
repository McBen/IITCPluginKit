/// <reference path="./android.d.ts" />
/// <reference path="./dialog.d.ts" />
/// <reference path="./types.d.ts" />
/// <reference path="./constants.d.ts" />
/// <reference path="./hooks.d.ts" />
/// <reference path="./intel_chat.d.ts" />
/// <reference path="./intel_player.d.ts" />

/**
 * @module IITC
 */


interface MapDataRequest {
    REFRESH_CLOSE: number;
    REFRESH_FAR: number;
    refreshOnTimeout(time: number): void;
    status: { short: string };
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
    selectedPortal: string | null;

    /** list of all loaded portals */
    portals: { [guid: string]: IITC.Portal };

    /** list of all loaded links */
    links: { [guid: string]: IITC.Link };

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

    /* #endregion */

    startRefreshTimeout(): void;

    getPortalLinks(guid: string): IITC.PortalLinks;

    getPortalFields(guid: string): IITC.Field[];


    /* #region  Portal Viewing */
    /** Load & show Portal Details Window */
    renderPortalDetails(guid: string): void;

    /** Make sure Portal is visible in Window */
    zoomToAndShowPortal(guid: string, position: L.LatLng): void;

    /* #endregion */

    /** Create Portal-Marker */
    createMarker(position: L.LatLng, options: IITC.PortalOptions): L.CircleMarker;


    // Map Stuff
    getMapZoomTileParameters(dataZoom: number): any;
    getDataZoomForMapZoom(mapZoom: number): number;
    selectPortalByLatLng(lat: number, lng: number): void;


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

    // Android    
    useAndroidPanes(): boolean;
    currentPane: string;
    show(paneID: string);
}

type BootCallback = () => void;


declare function load(name: string): any;

declare const PLAYER: Intel.PlayerInfo;

