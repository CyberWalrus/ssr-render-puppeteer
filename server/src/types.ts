export type SSRCache = {
    content: string;
    brBuffer?: Buffer;
    gzipBuffer?: Buffer;
};

export type SSRCacheKey = {
    value: string;
    isDisabledCache?: boolean;
    lifetime?: number;
    refreshTime?: number;
};

export type ScheduleWithDelayProps = {
    task: () => Promise<unknown> | unknown;
    delay?: number;
    hasStartDelay?: boolean;
    retryCount?: number;
    retryDelay?: number;
    shouldStop?: () => Promise<boolean> | boolean;
    startDelay?: number;
};
