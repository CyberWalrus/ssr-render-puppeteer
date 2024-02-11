/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
// import { DEFAULT_LOOP_DELAY, DEFAULT_RETRY_DELAY } from './constants';

import { DEFAULT_LOOP_DELAY, DEFAULT_RETRY_COUNT, DEFAULT_RETRY_DELAY } from './constants';

type ScheduleWithDelayProps = {
    task: () => Promise<unknown> | unknown;
    hasStartDelay?: boolean;
    retryCount?: number;
    retryTimeout?: number;
    shouldStop?: () => Promise<boolean> | boolean;
    timeout?: number;
};

const setTimeoutPromise = (timeout: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });

export const scheduleWithDelay = async ({
    task,
    shouldStop = () => false,
    timeout = DEFAULT_LOOP_DELAY,
    retryTimeout = DEFAULT_RETRY_DELAY,
    hasStartDelay = false,
    retryCount = DEFAULT_RETRY_COUNT,
}: ScheduleWithDelayProps) => {
    let currentRetryCount = retryCount;

    if (hasStartDelay) {
        await setTimeoutPromise(timeout);
    }

    while (true) {
        try {
            if (await shouldStop()) {
                break;
            }

            await task();
            await setTimeoutPromise(timeout);
            currentRetryCount = retryCount;
        } catch (error) {
            console.error('Task execution failed:', error);

            if (currentRetryCount <= 0) {
                console.log('Exceeded maximum retry count');
                break;
            }

            currentRetryCount -= 1;
            await setTimeoutPromise(retryTimeout);
        }
    }
};
