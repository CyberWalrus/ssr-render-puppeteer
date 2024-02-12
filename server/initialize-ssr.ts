/* eslint-disable no-throw-literal */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { createCacheManager } from './cache-manager';
import { initializePuppeteer } from './initialize-puppeteer';
import { scheduleWithDelay } from './schedule-with-delay';
import type { CacheSSR } from './types';

export const initializeSSR = (initialURLs: string[]) => {
    const { generateSSR } = initializePuppeteer();
    const { setCache, getCache, addKey, deleteKey, getKeys, resetTrackedKeys } =
        createCacheManager<CacheSSR>(initialURLs);
    const ongoingUpdates = new Map<string, () => void>();

    const updateContent = async (url: string) => {
        const html = await generateSSR(url);

        setCache(url, html);

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

    const getRenderedContent = async (url: string) => {
        const cache = getCache(url);

        if (cache) {
            return cache;
        }

        const value = await updateContent(url);

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
        getRenderedContent,
        resetTrackedUrls: resetTrackedKeys,
    };
};
