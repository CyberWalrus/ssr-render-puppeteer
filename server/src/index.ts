import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { HOST, PAGE_LIST, PORT } from './constants';
import { createSSRHandler, errorHandler } from './handlers';
import { initializeSSR } from './ssr';

const { getSSRContent } = initializeSSR(PAGE_LIST);

const app = express();

app.get('/*', createSSRHandler(getSSRContent));

const staticProxyMiddleware = createProxyMiddleware({
    changeOrigin: true,
    logLevel: 'error',
    target: HOST,
});

app.use(staticProxyMiddleware);

app.use(errorHandler);

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app start http://localhost:${PORT}/`);
});
