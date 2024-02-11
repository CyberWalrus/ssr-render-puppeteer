/* eslint-disable no-console */
import { launch } from 'puppeteer';

import { PUPPETEER_OPTIONS, REFRESH_BROWSER_TIMEOUT, WAIT_FOR_SELECTOR_TIMEOUT } from './constants';
import { scheduleWithDelay } from './schedule-with-delay';

export const initializePuppeteer = () => {
    let isLoading = false;
    let browserInstance = launch(PUPPETEER_OPTIONS);

    const refreshBrowser = async () => {
        if (isLoading) {
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
        isLoading = true;
        const browser = await browserInstance;
        const page = await browser.newPage();
        const start = Date.now();

        try {
            await page.goto(url, { waitUntil: 'networkidle0' });
            await page.waitForSelector('#root', { timeout: WAIT_FOR_SELECTOR_TIMEOUT });
            const html = await page.content();
            const end = Date.now();
            console.log(`SSR for ${url} took ${end - start}ms`);

            return html;
        } finally {
            await page.close();
            isLoading = false;
        }
    };

    return { generateSSR };
};
