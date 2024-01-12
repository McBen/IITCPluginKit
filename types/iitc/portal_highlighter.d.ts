export { };

declare global {
    interface Hightligher {
        hightlight: (data: { portal: IITC.Portal }) => void;
        setSelected?: (activate: boolean) => void;
    }

    /** an object mapping highlighter names to the object containing callback functions */
    let _highlighters: { [name: string]: Hightligher } | null;

    /** the name of the current highlighter */
    let _current_highlighter: string | undefined;

    /**
     * = "No Highlights"
     */
    let _no_highlighter: string;

    function addPortalHighlighter(name: string, data: Hightligher): void;

    // (re)creates the highlighter dropdown list
    function updatePortalHighlighterControl(): void;
    function changePortalHighlights(name: string | undefined): void;

    function highlightPortal(p: IITC.Portal): void;
    function resetHighlightedPortals(): void;
}
