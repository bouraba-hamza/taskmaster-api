import { createLogger, format, transports, Logger } from 'winston';
import { Request, Response, NextFunction } from 'express';
import os from 'os';

const { combine, timestamp, errors, json } = format;

// Ensure we have an application version in metadata (helpful in logs). Do not throw here
// to keep test/simple runs smooth; set to 'unknown' when not provided.
const appVersion = process.env.APP_VERSION ?? 'unknown';

const defaultMeta = {
    service: process.env.SERVICE_NAME ?? 'taskmaster',
    env: process.env.NODE_ENV ?? 'development',
    host: os.hostname(),
    version: appVersion,
};

const logger: Logger = createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta,
    transports: [new transports.Console({ level: process.env.LOG_LEVEL ?? 'info' })],
});

// Optional: if the environment requests file rotation, try to add DailyRotateFile
if (process.env.LOG_TO_FILES === 'true') {
    try {
        // Require at runtime so this dependency is optional during development/tests.
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        const DailyRotateFile = require('winston-daily-rotate-file');
        logger.add(
            new DailyRotateFile({
                dirname: process.env.LOG_DIR || '/var/log/taskmaster',
                filename: 'taskmaster-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: false,
                maxSize: '100m',
                maxFiles: '14d',
                level: process.env.LOG_LEVEL || 'info',
            })
        );
    } catch (e) {
        // If the optional transport isn't available, don't fail startup. Write a console warning.
        // eslint-disable-next-line no-console
        console.warn('winston-daily-rotate-file not available; continuing with Console transport');
    }
}

// Convenience wrappers that accept either a string or structured object.
export const logInfo = (payload: string | Record<string, unknown>) => {
    if (typeof payload === 'string') logger.info(payload);
    else logger.info('info', payload);
};

export const logError = (payload: string | Record<string, unknown>) => {
    if (typeof payload === 'string') logger.error(payload);
    else logger.error(payload);
};

// Express middleware logger (HTTP access logging). Logs structured JSON with timing.
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            event: 'request_finished',
            method,
            url,
            statusCode: res.statusCode,
            durationMs: duration,
        });
    });
    next();
};

export default logger;