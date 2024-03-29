export { };

declare global {
    function resetScrollOnNewPortal(): void;

    /**
     * Load & show Portal Details Window
     */
    function renderPortalDetails(guid: PortalGUID | null): void;

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
