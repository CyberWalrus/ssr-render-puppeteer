/* eslint-disable no-console */
import { launch } from 'puppeteer';
import { brotliCompress, gzip } from 'zlib';

import {
    DEFAULT_PAGE_SELECTOR,
    PUPPETEER_OPTIONS,
    REFRESH_BROWSER_TIMEOUT,
    WAIT_FOR_SELECTOR_TIMEOUT,
} from '../constants';
import { scheduleWithDelay } from '../helpers';
import type { SSRCache } from '../types';

export const initializePuppeteer = () => {
    let activeLoadingCount = 0;
    let browserInstance = launch(PUPPETEER_OPTIONS);

    const refreshBrowser = async () => {
        if (activeLoadingCount > 0) {
            return;
        }

        const browser = await browserInstance;
        await browser.close();

        browserInstance = launch(PUPPETEER_OPTIONS);
        console.log(`Browser reopen`);
    };

    scheduleWithDelay({ delay: REFRESH_BROWSER_TIMEOUT, hasStartDelay: true, task: refreshBrowser }).catch(
        console.error,
    );

    const generateSSR = async (url: string) => {
        activeLoadingCount += 1;
        const browser = await browserInstance;
        const page = await browser.newPage();
        const start = Date.now();

        try {
            await page.goto(url, { waitUntil: 'networkidle0' });
            await page.waitForSelector(DEFAULT_PAGE_SELECTOR, { timeout: WAIT_FOR_SELECTOR_TIMEOUT });
            const content = await page.content();
            const endSSR = Date.now();
            console.log(`SSR for ${url} took ${endSSR - start}ms`);

            const brBuffer: Buffer | undefined = await new Promise((resolve) => {
                brotliCompress(Buffer.from(content), (error, result) => {
                    if (error) {
                        resolve(undefined);

                        return;
                    }

                    resolve(result);
                });
            });

            const gzipBuffer: Buffer | undefined = await new Promise((resolve) => {
                gzip(Buffer.from(content), (error, result) => {
                    if (error) {
                        resolve(undefined);

                        return;
                    }

                    resolve(result);
                });
            });

            const endCompress = Date.now();
            console.log(`Compress for ${url} took ${endCompress - endSSR}ms`);

            const html: SSRCache = {
                brBuffer,
                content,
                gzipBuffer,
            };

            return html;
        } finally {
            await page.close().catch(console.error);

            activeLoadingCount -= 1;
        }
    };

    return { generateSSR };
};
