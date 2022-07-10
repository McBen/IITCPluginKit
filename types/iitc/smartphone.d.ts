export { };

declare global {
    /**
     * this check is also used in main.js. Note it should not detect
     * tablets because their display is large enough to use the desktop version.
     *
     * The stock intel site allows forcing mobile/full sites with a vp=m or vp=f
     * parameter - let's support the same. (stock only allows this for some
     * browsers - e.g. android phone/tablet. let's allow it for all, but
     * no promises it'll work right)
     */
    function isSmartphone(): boolean;

    // Android
    let currentPane: string;
    function show(paneID: string): void;
    function hideall(): void;

    function runOnSmartphonesBeforeBoot(): void;
    function runOnSmartphonesAfterBoot(): void;

    function smartphoneInfo(data: { selectedPortalGuid: PortalGUID }): void;

    function setAndroidPermalink(): void;
    function useAndroidPanes(): boolean;
}
