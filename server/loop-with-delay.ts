/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

export const loopWithDelay = async ({
    callback,
    checkIsEnd,
    timeout = 10_000,
}: {
    callback: () => Promise<void> | void;
    checkIsEnd: () => Promise<boolean> | boolean;
    timeout?: number;
}) => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const isEnd = await checkIsEnd();

            if (isEnd) {
                return;
            }

            await callback();

            await new Promise((resolve) => {
                setTimeout(resolve, timeout);
            });
        } catch (error) {
            console.error(error);
        }
    }
};
