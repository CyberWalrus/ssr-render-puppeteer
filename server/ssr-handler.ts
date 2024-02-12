import type { RequestHandler } from 'express';

import { FILE_REGEXP, PAGE_URL } from './constants';
import type { CacheSSR } from './types';

export const createSSRHandler =
    (getSSRContent: (url: string) => Promise<CacheSSR>): RequestHandler =>
    async (req, res, next) => {
        try {
            if (FILE_REGEXP.test(req.path)) {
                next();

                return;
            }
            const fullPageUrl = new URL(req.path, PAGE_URL).toString();

            const { content, gzipBuffer, brBuffer } = await getSSRContent(fullPageUrl);
            const acceptEncoding = req.headers['accept-encoding'];

            res.setHeader('Content-Type', 'text/html');

            if (acceptEncoding?.includes('br')) {
                res.setHeader('Content-Encoding', 'br');

                res.status(200).send(brBuffer);

                return;
            }

            if (acceptEncoding?.includes('gzip')) {
                res.setHeader('Content-Encoding', 'gzip');

                res.status(200).send(gzipBuffer);

                return;
            }

            res.status(200).send(content);
        } catch (error) {
            next(error);
        }
    };
