/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import express from 'express';

import { PAGE_URL, PORT } from './constants';
import { initSSR } from './init-ssr';

const app = express();

const { getSSR } = initSSR();

app.get('/', async (req, res) => {
    try {
        const html = await getSSR(PAGE_URL);

        return res.status(200).send(html);
    } catch (error) {
        res.send(error);
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
