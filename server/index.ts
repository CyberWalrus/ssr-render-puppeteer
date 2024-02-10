/* eslint-disable no-console */
import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const run = async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:4173/');
        await page.screenshot({ path: 'screenshot/screenshot.png' });
        browser.close().catch(console.log);
        res.sendFile('../screenshot/screenshot.png');
    };
    run().catch(console.log);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
