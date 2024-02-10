/* eslint-disable no-console */
import puppeteer from 'puppeteer';

import { PUPPETEER_OPTIONS, REFRESH_BROWSER_TIMEOUT, WAIT_FOR_SELECTOR_TIMEOUT } from './constants';
import { scheduleWithDelay } from './schedule-with-delay';

export const initializePuppeteer = () => {
    let isLoading = false;
    let browserInstance = puppeteer.launch(PUPPETEER_OPTIONS);

    const refreshBrowser = async () => {
        if (isLoading) {
            return;
        }

        const browser = await browserInstance;
        await browser.close();

        browserInstance = puppeteer.launch(PUPPETEER_OPTIONS);
        console.log(`Browser reopen`);
    };

    scheduleWithDelay({ hasStartDelay: true, task: refreshBrowser, timeout: REFRESH_BROWSER_TIMEOUT }).catch(
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
        } catch (error) {
            console.error(`SSR error for ${url}:`, error);
            throw error;
        } finally {
            await page.close();
            isLoading = false;
        }
    };

    return { generateSSR };
};
