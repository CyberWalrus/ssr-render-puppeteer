/* eslint-disable @typescript-eslint/no-floating-promises */
import { createCacheManager } from './cache-manager';
import { generateSSR } from './generate-ssr';
import { scheduleWithDelay } from './schedule-with-delay';

export const initializeSSR = (initialURLs: string[]) => {
    const { setCache, getCache, addUrl, deleteUrl, getUrls, resetTrackedUrls } = createCacheManager(initialURLs);
    const ongoingUpdates = new Map<string, () => void>();

    const updateContent = async (url: string) => {
        const content = await generateSSR(url);
        setCache(url, content);
    };

    const forceUpdate = (url: string) => {
        ongoingUpdates.get(url)?.();

        let stop = false;
        const stopUpdate = () => {
            stop = true;
        };
        ongoingUpdates.set(url, stopUpdate);

        const task = async () => updateContent(url);
        scheduleWithDelay({ shouldStop: () => stop, task });
    };

    const getRenderedContent = async (url: string) => {
        let content = getCache(url);
        if (!content) {
            content = await generateSSR(url);
            setCache(url, content);
        }

        forceUpdate(url);

        return content;
    };

    const initializeUpdates = () => {
        for (const url of getUrls()) {
            forceUpdate(url);
        }
    };

    initializeUpdates();

    return {
        addUrl,
        deleteUrl,
        forceUpdate,
        getRenderedContent,
        resetTrackedUrls,
    };
};
