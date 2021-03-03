
interface Window {
    idleTime: number; // in seconds

    /** default MAX_IDLE_TIME */
    _idleTimeLimit: number;
    IDLE_POLL_TIME: number;

    idlePoll(): void;
    idleReset(): void;
    idleSet(): void;
    setupIdle(): void;

    /**
     * add your function here if you want to be notified when the user
     * resumes from being idle
     */
    addResumeFunction(fct: () => void): void;
}
