import { initCache } from './cache';
import { generateSSR } from './generate-ssr';

export const initSSR = () => {
    const { setCache, getCache } = initCache();

    const getSSR = async (url: string) => {
        const cache = getCache(url);

        if (cache) {
            return cache;
        }

        const html = await generateSSR(url);

        setCache(url, html);
    };

    const updateSSR = async (url: string) => {
        const cache = getCache(url);

        if (cache) {
            return cache;
        }

        const html = await generateSSR(url);

        setCache(url, html);
    };

    return { getSSR, updateSSR };
};
