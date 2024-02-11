/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err: Error, req, res, next) => {
    console.error(err);
    res.status(500).json(JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err))));
};
