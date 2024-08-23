export const SECONDS = 1000;
export const MINUTES = 60 * SECONDS;
export const HOURS = 60 * MINUTES;
export const DAYS = 24 * HOURS;
export const MONTH = 30 * DAYS;


export const formatTimePastNow = (date: Date): string => {
    return formatIntervalShort(Date.now() - date.getTime());
}


export const formatIntervalShort = (ms: number): string => {

    const seconds = Math.floor(ms / SECONDS);

    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) {
        const sr = s - (s % 10);
        if (sr > 0) return `${m}m ${sr}s`;
        else return `${m}m`;
    }

    return "<1min";
}

