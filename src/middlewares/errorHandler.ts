import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Centralized error handler. It does two things:
// 1. Logs the full error (including stack and request context) so that
//    operators can inspect it in CloudWatch or other log sinks.
// 2. Returns a safe JSON response to the client. In production we DO NOT
//    expose the stack trace to avoid leaking implementation details.
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;

    // Log full error details for observability. Keep the message concise and
    // include request context so you can find where the error came from in the cloud logger.
    try {
        const bodyForLogs = process.env.NODE_ENV === 'production'
            ? { keys: Object.keys(req.body || {}), truncated: true }
            : req.body;

        const requestContext = {
            method: req.method,
            url: req.originalUrl || req.url,
            params: req.params,
            query: req.query,
            // Body is redacted in production to avoid PII/leaking large payloads
            body: bodyForLogs,
            statusCode,
            requestId: req.headers['x-request-id'] || null,
        };

        // Use structured logging so cloud log collectors can index fields.
        logger.error({
            event: 'unhandled_error',
            message,
            stack: stack ?? '<no-stack>',
            context: requestContext,
        });
    } catch (loggingError) {
        // If logging fails for any reason, at least write to stderr so platform logs capture it.
        // eslint-disable-next-line no-console
        console.error('Failed to log error in errorHandler:', loggingError);
    }

    // Send a safe response to the client. In production we intentionally omit the
    // stack trace from the HTTP response (set to null) to avoid leaking internals.
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : stack,
    });
};