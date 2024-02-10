import { DEFAULT_LIFETIME_CACHE } from './constants';

export const createCacheManager = (initialUrls?: string[]) => {
    const cacheStorage = new Map<string, string>();
    const expiryTimers = new Map<string, NodeJS.Timeout>();
    const initialUrlSet = Array.isArray(initialUrls) ? initialUrls : [];

    let trackedUrls = new Set<string>([...initialUrlSet]);

    const clearTimeoutAndDeleteCache = (key: string) => {
        clearTimeout(expiryTimers.get(key));
        expiryTimers.delete(key);
        cacheStorage.delete(key);
    };

    const getUrls = () => [...trackedUrls];

    const hasUrl = (url: string) => trackedUrls.has(url);

    const addUrl = (url: string) => {
        trackedUrls.add(url);
    };

    const deleteUrl = (url: string) => {
        trackedUrls.delete(url);
        clearTimeoutAndDeleteCache(url);
    };

    const resetTrackedUrls = (urls: string[]) => {
        const newTrackedUrls = Array.isArray(urls) ? urls : [];
        trackedUrls = new Set([...newTrackedUrls]);

        [...expiryTimers.keys()].forEach((key) => {
            if (trackedUrls.has(key)) {
                return;
            }

            clearTimeoutAndDeleteCache(key);
        });
    };

    const setCache = (key: string, value: string, expiresIn?: number) => {
        if (expiryTimers.has(key)) {
            clearTimeout(expiryTimers.get(key));
            expiryTimers.delete(key);
        }

        cacheStorage.set(key, value);

        const expiryTimer = setTimeout(() => {
            clearTimeoutAndDeleteCache(key);
        }, expiresIn ?? DEFAULT_LIFETIME_CACHE);

        expiryTimers.set(key, expiryTimer);
    };

    const getCache = (key: string) => cacheStorage.get(key);

    return { addUrl, deleteUrl, getCache, getUrls, hasUrl, resetTrackedUrls, setCache };
};
