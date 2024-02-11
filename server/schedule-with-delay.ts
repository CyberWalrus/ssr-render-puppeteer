/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

import { DEFAULT_LOOP_DELAY, DEFAULT_RETRY_COUNT, DEFAULT_RETRY_DELAY, DEFAULT_START_DELAY } from './constants';

type ScheduleWithDelayProps = {
    task: () => Promise<unknown> | unknown;
    delay?: number;
    hasStartDelay?: boolean;
    retryCount?: number;
    retryDelay?: number;
    shouldStop?: () => Promise<boolean> | boolean;
    startDelay?: number;
};

const setTimeoutPromise = (timeout: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });

export const scheduleWithDelay = async ({
    task,
    shouldStop = () => false,
    delay = DEFAULT_LOOP_DELAY,
    startDelay = DEFAULT_START_DELAY,
    retryDelay = DEFAULT_RETRY_DELAY,
    hasStartDelay = false,
    retryCount = DEFAULT_RETRY_COUNT,
}: ScheduleWithDelayProps) => {
    let currentRetryCount = retryCount;

    if (hasStartDelay) {
        await setTimeoutPromise(startDelay);
    }

    while (true) {
        try {
            if (await shouldStop()) {
                break;
            }

            await task();
            await setTimeoutPromise(delay);
            currentRetryCount = retryCount;
        } catch (error) {
            console.error('Task execution failed:', error);

            if (currentRetryCount <= 0) {
                console.error('Exceeded maximum retry count');
                break;
            }

            currentRetryCount -= 1;
            await setTimeoutPromise(retryDelay);
        }
    }
};
