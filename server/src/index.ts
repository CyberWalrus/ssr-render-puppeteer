import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { HOST, PORT } from './constants';
import { createSSRHandler, errorHandler } from './handlers';
import { initializeSSR } from './ssr';

const { getSSRContent } = initializeSSR([HOST, `${HOST}about`]);

const app = express();

app.get('/*', createSSRHandler(getSSRContent));

const staticProxyMiddleware = createProxyMiddleware({
  target: 'http://localhost:4173',
  changeOrigin: true,
  logLevel: 'error'
});

app.use(staticProxyMiddleware);

app.use(errorHandler);

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app start http://localhost:${PORT}/`);
});
