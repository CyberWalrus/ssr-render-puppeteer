/* eslint-disable no-throw-literal */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { createCacheManager } from './cache-manager';
import { DEFAULT_LIFETIME_UNKNOWN_PAGE } from './constants';
import { initializePuppeteer } from './initialize-puppeteer';
import { scheduleWithDelay } from './schedule-with-delay';
import type { CacheSSR } from './types';

export const initializeSSR = (initialURLs: string[]) => {
    const { generateSSR } = initializePuppeteer();
    const { setCache, getCache, addKey, deleteKey, getKeys, resetTrackedKeys, hasKey } =
        createCacheManager<CacheSSR>(initialURLs);
    const ongoingUpdates = new Map<string, () => void>();

    const updateContent = async (url: string, expires?: number) => {
        const html = await generateSSR(url);

        setCache(url, html, expires);

        return html;
    };

    const forceUpdate = (url: string, hasStartDelay?: boolean) => {
        ongoingUpdates.get(url)?.();

        let stop = false;
        const stopUpdate = () => {
            stop = true;
        };
        const shouldStop = () => stop;
        ongoingUpdates.set(url, stopUpdate);

        const task = async () => updateContent(url);
        scheduleWithDelay({ hasStartDelay, shouldStop, task });
    };

    const getSSRContent = async (url: string) => {
        const cache = getCache(url);

        if (cache) {
            return cache;
        }

        const expires = hasKey(url) ? undefined : DEFAULT_LIFETIME_UNKNOWN_PAGE;

        const value = await updateContent(url, expires);

        if (expires === undefined) {
            return value;
        }

        forceUpdate(url, true);

        return value;
    };

    const initializeUpdates = () => {
        for (const url of getKeys()) {
            forceUpdate(url);
        }
    };

    initializeUpdates();

    return {
        addUrl: addKey,
        deleteUrl: deleteKey,
        forceUpdate,
        getSSRContent,
        resetTrackedUrls: resetTrackedKeys,
    };
};
