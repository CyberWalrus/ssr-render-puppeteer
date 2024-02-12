export type SSRCache = {
    content: string;
    brBuffer?: Buffer;
    gzipBuffer?: Buffer;
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
