import { Request, Response, NextFunction } from 'express';
import { validateTask } from '../../src/validators/taskValidator';
import { validationResult } from 'express-validator';

// Mock express-validator
jest.mock('express-validator', () => ({
    body: jest.fn(() => ({
        isString: jest.fn().mockReturnThis(),
        notEmpty: jest.fn().mockReturnThis(),
        withMessage: jest.fn().mockReturnThis(),
        optional: jest.fn().mockReturnThis(),
        isBoolean: jest.fn().mockReturnThis(),
    })),
    validationResult: jest.fn(),
}));

describe('Task Validator', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should export an array of validation middleware', () => {
        expect(Array.isArray(validateTask)).toBe(true);
        expect(validateTask).toHaveLength(3); // title, description, completed validation chains
    });

    it('should call next() when validation passes', () => {
        const mockValidationResult = validationResult as jest.MockedFunction<typeof validationResult>;
        mockValidationResult.mockReturnValue({
            isEmpty: () => true,
            array: () => [],
        } as any);

        // Get the validation result handler (last middleware in the array)
        const validationHandler = validateTask[validateTask.length - 1] as any;
        
        validationHandler(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 400 with errors when validation fails', () => {
        const mockErrors = [
            { msg: 'Title is required' },
            { msg: 'Description must be a string' },
        ];

        const mockValidationResult = validationResult as jest.MockedFunction<typeof validationResult>;
        mockValidationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => mockErrors,
        } as any);

        // Get the validation result handler (last middleware in the array)
        const validationHandler = validateTask[validateTask.length - 1] as any;
        
        validationHandler(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: mockErrors,
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
});