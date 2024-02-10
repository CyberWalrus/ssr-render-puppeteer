import puppeteer from 'puppeteer';

import { WAIT_FOR_SELECTOR_TIMEOUT } from './constants';

export const generateSSR = async (url: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#root', { timeout: WAIT_FOR_SELECTOR_TIMEOUT });

    const html = await page.content();

    await browser.close();

    return html;
};
