import { DEFAULT_MS } from './constants';

export const initCache = () => {
    const cache = new Map<string, string>();
    const timeoutList = new Map<string, NodeJS.Timeout>();

    const setCache = (key: string, value: string, ms?: number) => {
        if (timeoutList.has(key)) {
            clearTimeout(timeoutList.get(key));
            timeoutList.delete(key);
        }

        cache.set(key, value);

        const timeout = setTimeout(() => {
            timeoutList.delete(key);

            if (!cache.has(key)) {
                return;
            }

            cache.delete(key);
        }, ms ?? DEFAULT_MS);

        timeoutList.set(key, timeout);
    };

    const getCache = (key: string) => {
        if (!cache.has(key)) {
            return undefined;
        }

        return cache.get(key);
    };

    return { getCache, setCache };
};
