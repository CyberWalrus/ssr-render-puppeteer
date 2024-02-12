import { DEFAULT_LIFETIME_CACHE } from '../constants';

export const createCacheManager = <T>(initialKeys?: string[]) => {
    const cacheStorage = new Map<string, T>();
    const expiryTimers = new Map<string, NodeJS.Timeout>();
    const initialKeySet = Array.isArray(initialKeys) ? initialKeys : [];

    let trackedKeys = new Set<string>([...initialKeySet]);

    const clearTimeoutAndDeleteCache = (key: string) => {
        clearTimeout(expiryTimers.get(key));
        expiryTimers.delete(key);
        cacheStorage.delete(key);
    };

    const getKeys = () => [...trackedKeys];

    const hasKey = (key: string) => trackedKeys.has(key);

    const addKey = (key: string) => {
        trackedKeys.add(key);
    };

    const deleteKey = (key: string) => {
        trackedKeys.delete(key);
        clearTimeoutAndDeleteCache(key);
    };

    const resetTrackedKeys = (keys: string[]) => {
        const newTrackedKeys = Array.isArray(keys) ? keys : [];
        trackedKeys = new Set([...newTrackedKeys]);

        [...expiryTimers.keys()].forEach((key) => {
            if (trackedKeys.has(key)) {
                return;
            }

            clearTimeoutAndDeleteCache(key);
        });
    };

    const setCache = (key: string, value: T, expires?: number) => {
        if (expiryTimers.has(key)) {
            clearTimeout(expiryTimers.get(key));
            expiryTimers.delete(key);
        }

        cacheStorage.set(key, value);

        const expiryTimer = setTimeout(() => {
            clearTimeoutAndDeleteCache(key);
        }, expires ?? DEFAULT_LIFETIME_CACHE);

        expiryTimers.set(key, expiryTimer);
    };

    const getCache = (key: string) => cacheStorage.get(key);

    return { addKey, deleteKey, getCache, getKeys, hasKey, resetTrackedKeys, setCache };
};
