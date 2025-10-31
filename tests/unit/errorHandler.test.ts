import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../src/middlewares/errorHandler';
import logger from '../../src/utils/logger';

// Mock the logger
jest.mock('../../src/utils/logger', () => ({
    __esModule: true,
    default: {
        error: jest.fn(),
    },
}));

describe('ErrorHandler Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
    let mockLogger: jest.Mocked<typeof logger>;

    beforeEach(() => {
        mockLogger = logger as jest.Mocked<typeof logger>;
        mockLogger.error.mockClear();

        mockRequest = {
            method: 'GET',
            url: '/test',
            originalUrl: '/test',
            params: { id: '1' },
            query: { page: '1' },
            body: { data: 'test' },
            headers: { 'x-request-id': 'req-123' },
        };

        mockResponse = {
            statusCode: 200,
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockNext = jest.fn();

        // Mock console.error for logging error test
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should handle Error objects with development environment', () => {
        const error = new Error('Test error message');
        error.stack = 'Error stack trace';
        
        process.env.NODE_ENV = 'development';

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockLogger.error).toHaveBeenCalledWith({
            event: 'unhandled_error',
            message: 'Test error message',
            stack: 'Error stack trace',
            context: {
                method: 'GET',
                url: '/test',
                params: { id: '1' },
                query: { page: '1' },
                body: { data: 'test' },
                statusCode: 500,
                requestId: 'req-123',
            },
        });

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: 'Test error message',
            stack: 'Error stack trace',
        });
    });

    it('should handle Error objects with production environment', () => {
        const error = new Error('Test error message');
        error.stack = 'Error stack trace';
        
        process.env.NODE_ENV = 'production';

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: 'Test error message',
            stack: null,
        });
    });

    it('should handle non-Error objects', () => {
        const error = 'String error';
        
        process.env.NODE_ENV = 'development';

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockLogger.error).toHaveBeenCalledWith({
            event: 'unhandled_error',
            message: 'String error',
            stack: '<no-stack>',
            context: expect.any(Object),
        });

        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: 'String error',
            stack: undefined,
        });
    });

    it('should handle errors when response status is not 200', () => {
        const error = new Error('Test error');
        mockResponse.statusCode = 404;

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should handle missing originalUrl', () => {
        const error = new Error('Test error');
        delete mockRequest.originalUrl;

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockLogger.error).toHaveBeenCalledWith(
            expect.objectContaining({
                context: expect.objectContaining({
                    url: '/test',
                }),
            })
        );
    });

    it('should handle missing request-id header', () => {
        const error = new Error('Test error');
        mockRequest.headers = {}; // Empty headers object instead of deleting

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockLogger.error).toHaveBeenCalledWith(
            expect.objectContaining({
                event: 'unhandled_error',
                context: expect.objectContaining({
                    requestId: null,
                }),
            })
        );
    });

    it('should handle logging errors gracefully', () => {
        const error = new Error('Test error');
        mockLogger.error.mockImplementation(() => {
            throw new Error('Logging failed');
        });

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(console.error).toHaveBeenCalledWith('Failed to log error in errorHandler:', expect.any(Error));
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should redact body in production environment', () => {
        const error = new Error('Test error');
        process.env.NODE_ENV = 'production';
        mockRequest.body = { password: 'secret', data: 'test' };

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockLogger.error).toHaveBeenCalledWith(
            expect.objectContaining({
                context: expect.objectContaining({
                    body: { keys: ['password', 'data'], truncated: true },
                }),
            })
        );
    });

    it('should include full body in non-production environment', () => {
        const error = new Error('Test error');
        process.env.NODE_ENV = 'development';
        mockRequest.body = { password: 'secret', data: 'test' };

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockLogger.error).toHaveBeenCalledWith(
            expect.objectContaining({
                context: expect.objectContaining({
                    body: { password: 'secret', data: 'test' },
                }),
            })
        );
    });
});