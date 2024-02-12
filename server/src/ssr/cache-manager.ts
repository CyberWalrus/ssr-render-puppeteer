/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { SSRCacheKey } from 'src/types';

import { DEFAULT_LIFETIME_CACHE } from '../constants';

export const createCacheManager = <GCache>(initialKeys?: SSRCacheKey[]) => {
    const cacheStorage = new Map<string, GCache>();
    const expiryTimers = new Map<string, NodeJS.Timeout>();
    const initialKeyList: ReadonlyArray<[string, SSRCacheKey]> = Array.isArray(initialKeys)
        ? initialKeys.map((item) => [item.value, item])
        : [];

    let trackedKeys = new Map<string, SSRCacheKey>([...initialKeyList]);

    const clearTimeoutAndDeleteCache = (key: string) => {
        clearTimeout(expiryTimers.get(key));
        expiryTimers.delete(key);
        cacheStorage.delete(key);
    };

    const getKeys = () => [...trackedKeys];

    const hasKey = (key: string) => trackedKeys.has(key);

    const getKey = (key: string) => trackedKeys.get(key);

    const addKey = (key: SSRCacheKey) => {
        trackedKeys.set(key.value, key);
    };

    const deleteKey = (key: string) => {
        trackedKeys.delete(key);
        clearTimeoutAndDeleteCache(key);
    };

    const resetTrackedKeys = (keys: SSRCacheKey[]) => {
        const newTrackedKeys: ReadonlyArray<[string, SSRCacheKey]> = Array.isArray(keys)
            ? keys.map((item) => [item.value, item])
            : [];
        trackedKeys = new Map([...newTrackedKeys]);

        [...expiryTimers.keys()].forEach((key) => {
            if (trackedKeys.has(key)) {
                return;
            }

            clearTimeoutAndDeleteCache(key);
        });
    };

    const setCache = (key: string, value: GCache, expires?: number) => {
        if (expiryTimers.has(key)) {
            clearTimeout(expiryTimers.get(key));
            expiryTimers.delete(key);
        }

        if (trackedKeys.get(key)?.isDisabledCache) {
            return;
        }

        cacheStorage.set(key, value);

        const expiryTimer = setTimeout(
            () => {
                clearTimeoutAndDeleteCache(key);
            },
            expires ?? trackedKeys.get(key)?.lifetime ?? DEFAULT_LIFETIME_CACHE,
        );

        expiryTimers.set(key, expiryTimer);
    };

    const getCache = (key: string) => cacheStorage.get(key);

    return { addKey, deleteKey, getCache, getKey, getKeys, hasKey, resetTrackedKeys, setCache };
};
