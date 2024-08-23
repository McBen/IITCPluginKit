export const isMobile = () => {
    //@ts-ignore
    return (typeof android !== "undefined" && !!android);
};
export const isiOS = () => {
    //@ts-ignore
    return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
};
/* DEBUG-START */
if (console && typeof (console.assert) === "undefined") {
    console.assert = (condition, message, ..._data) => {
        if (!condition) {
            console.error(message || "assertion failed");
        }
    };
}
/* DEBUG-END */
