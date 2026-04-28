export { };

declare global {
    function resetScrollOnNewPortal(): void;

    /**
     * Selects a portal, refresh its data and renders the details of the portal in the sidebar.
     *
     * @function renderPortalDetails
     * @param {string|null} guid - The globally unique identifier of the portal to display details for.
     * @param {boolean} [forceSelect=false] - If true, forces the portal to be selected even if it's already the current portal.
     */
    function renderPortalDetails(guid: PortalGUID | null, forceSelect = false): void;

    /**
     * Renders the details of a portal in the sidebar.
     *
     * @function renderPortalToSideBar
     * @param {L.PortalMarker} portal - The portal marker object holding portal details.
     */
    function renderPortalToSideBar(portal: IITC.Portal): void;


    function getPortalMiscDetails(guid: PortalGUID, details?: IITC.PortalDataDetail): string;

    /**
     * draws link-range and hack-range circles around the portal with the
     * given details. Clear them if parameter 'd' is null.
     */
    function setPortalIndicators(p: IITC.Portal): void;

    /**
     * highlights portal with given GUID. Automatically clears highlights
     * on old selection. Returns false if the selected portal changed.
     * @returns true if it's still the same portal that just needs an update.
     */
    function selectPortal(guid: PortalGUID | null): boolean;


}
