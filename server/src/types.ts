export type SSRCache = {
    content: string;
    brBuffer?: Buffer;
    gzipBuffer?: Buffer;
};

export type SSRCacheKey = {
    value: string;
    isDisabledCache?: boolean;
    isDisabledRefresh?: boolean;
    lifetime?: number;
    refreshDelay?: number;
    retryCount?: number;
    retryDelay?: number;
    startDelay?: number;
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
