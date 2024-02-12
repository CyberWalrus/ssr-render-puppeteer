export const setTimeoutPromise = (timeout: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
