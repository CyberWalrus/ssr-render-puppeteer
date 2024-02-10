/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'path';

import { PAGE_URL, PORT } from './constants';
import { initSSR } from './init-ssr';

const dirname = path.dirname(fileURLToPath(import.meta.url));

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

app.use(express.static(path.join(dirname, '../dist')));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
