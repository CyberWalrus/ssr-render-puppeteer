/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err: Error, req, res, next) => {
    console.error(err);

    const error = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err))) as Record<string, string>;

    res.status(500).json(error);
};
