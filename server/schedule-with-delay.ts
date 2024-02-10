/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { DEFAULT_LOOP_DELAY } from './constants';

type ScheduleWithDelayProps = {
    task: () => Promise<void> | void;
    hasStartDelay?: boolean;
    shouldStop?: () => Promise<boolean> | boolean;
    timeout?: number;
};

export const scheduleWithDelay = async ({
    task,
    shouldStop,
    timeout = DEFAULT_LOOP_DELAY,
    hasStartDelay = false,
}: ScheduleWithDelayProps) => {
    if (hasStartDelay) {
        await new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }

    while (true) {
        try {
            const isStop = await shouldStop?.();

            if (isStop) {
                return;
            }

            await task();

            await new Promise((resolve) => {
                setTimeout(resolve, timeout);
            });
        } catch (error) {
            console.error(error);
        }
    }
};
