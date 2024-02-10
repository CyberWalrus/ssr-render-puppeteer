/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

type ScheduleWithDelayProps = {
    shouldStop: () => Promise<boolean> | boolean;
    task: () => Promise<void> | void;
    hasStartDelay?: boolean;
    timeout?: number;
};

export const scheduleWithDelay = async ({
    task,
    shouldStop,
    timeout = 10_000,
    hasStartDelay = false,
}: ScheduleWithDelayProps) => {
    if (hasStartDelay) {
        await new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }

    while (true) {
        try {
            const isStop = await shouldStop();

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
