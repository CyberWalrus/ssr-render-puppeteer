/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import { fileURLToPath } from 'node:url';
import path from 'path';

import { PAGE_URL, PORT } from './constants';
import { errorHandler } from './error-handler';
import { initializeSSR } from './initialize-ssr';
import { createSSRHandler } from './ssr-handler';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const { getSSRContent } = initializeSSR([PAGE_URL, `${PAGE_URL}about`]);

const app = express();

app.get('/*', createSSRHandler(getSSRContent));

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
    console.log(`Example app start http://localhost:${PORT}/`);
});
