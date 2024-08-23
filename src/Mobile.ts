
export const isMobile = (): boolean => {
    //@ts-ignore
    return (typeof android !== "undefined" && !!android);
}

export const isiOS = (): boolean => {
    //@ts-ignore
    return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
}


/* DEBUG-START */
if (console && typeof (console.assert) === "undefined") {
    console.assert = (condition: boolean | undefined, message: string | undefined, ..._data: any[]): void => {
        if (!condition) {
            console.error(message || "assertion failed");
        }
    };
}
/* DEBUG-END */
