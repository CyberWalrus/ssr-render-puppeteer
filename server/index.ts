/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import { fileURLToPath } from 'node:url';
import path from 'path';

import { PAGE_URL, PORT } from './constants';
import { errorHandler } from './error-handler';
import { initializeSSR } from './initialize-ssr';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const { getRenderedContent } = initializeSSR([PAGE_URL]);

const app = express();

app.get('/', async (req, res, next) => {
    try {
        const html = await getRenderedContent(PAGE_URL);
        res.status(200).send(html);
    } catch (error) {
        next(error);
    }
});
app.use(
    '/',
    expressStaticGzip(path.join(dirname, '../dist'), {
        enableBrotli: true,
        orderPreference: ['br', 'gz'],
    }),
);
app.use(express.static(path.join(dirname, '../dist')));

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}/`);
});
