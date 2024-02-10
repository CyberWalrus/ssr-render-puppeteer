/* eslint-disable no-console */
import puppeteer from 'puppeteer';

import { WAIT_FOR_SELECTOR_TIMEOUT } from './constants';

const browserInstance = puppeteer.launch({ args: ['--no-sandbox'] });

export const generateSSR = async (url: string) => {
    const start = Date.now();
    const browser = await browserInstance;
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.waitForSelector('#root', { timeout: WAIT_FOR_SELECTOR_TIMEOUT });
        const html = await page.content();
        const end = Date.now();
        console.log(`SSR for ${url} took ${end - start}ms`);

        return html;
    } catch (error) {
        console.error(`SSR for ${url}:`, error);
        throw error;
    } finally {
        await page.close();
    }
};
