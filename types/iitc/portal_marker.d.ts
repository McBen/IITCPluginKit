export { };

declare global {
    /**
     * Calculates the scale of portal markers based on the current zoom level of the map.
     *
     * @function portalMarkerScale
     * @returns {number} The scale factor for portal markers.
     */
    function portalMarkerScale(): number;

    /**
     *  create a new marker. 'data' contain the IITC-specific entity data to be stored in the object options
     */
    function createMarker(latlng: L.LatLng, data: IITC.PortalData): IITC.Portal;

    /**
     * Sets the style of a portal marker, including options for when the portal is selected.
     *
     * @function setMarkerStyle
     * @param {L.PortalMarker} marker - The portal marker whose style will be set.
     * @param {boolean} selected - Indicates if the portal is selected.
     */

    function setMarkerStyle(marker: IITC.Portal, selected: boolean): void;

    /**
     * Determines the style options for a portal marker based on its details.
     *
     * @function getMarkerStyleOptions
     * @param {Object} details - Details of the portal, including team and level.
     * @returns {Object} Style options for the portal marker.
     */
    function getMarkerStyleOptions(details: IITC.PortalOptions): L.PathOptions;
}

declare namespace L {
    export class PortalMaker extends L.CircleMaker {
        willUpdate(details: IITC.PortalDataDetail): boolean;
        updateDetails(details: IITC.PortalDataDetail): void;
        getDetails(): IITC.PortalDataDetail;
        isPlaceholder(): boolean;
        hasFullDetails(): boolean;
        setStyle(style: any /* L style */): void;
        setMarkerStyle(style: any /* L style */): void;
        setSelected(selected: boolean)
    }
}