/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { createCacheManager } from './cache-manager';
import { generateSSR } from './generate-ssr';

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

export const initSSR = (initUrls?: string[]) => {
    const { setCache, getCache, addUrl, deleteUrl, getUrls, resetTrackedUrls } = createCacheManager(initUrls);
    const refreshList = new Map<string, () => void>();

    const getSSR = async (url: string) => {
        const cache = getCache(url);

        if (cache) {
            return cache;
        }

        const html = await generateSSR(url);

        setCache(url, html);

        return html;
    };

    const updateSSR = async (url: string) => {
        const html = await generateSSR(url);

        setCache(url, html);
    };

    const forceUpdateSSR = (url: string) => {
        refreshList.get(url)?.();

        let isEnd = false;
        const checkIsEnd = () => isEnd;
        const handleEndLoop = () => {
            isEnd = true;
        };
        refreshList.set(url, handleEndLoop);

        const callback = async () => {
            await updateSSR(url);
        };

        loopWithDelay({ callback, checkIsEnd });
    };

    const start = () => {
        const urls = getUrls();

        urls.forEach((url) => {
            forceUpdateSSR(url);
        });
    };

    start();

    return { addUrl, deleteUrl, forceUpdateSSR, getSSR, resetTrackedUrls };
};
