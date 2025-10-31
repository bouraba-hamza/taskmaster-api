import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateTask = [
    body('title')
        .isString()
        .notEmpty()
        .withMessage('Title is required and must be a non-empty string.'),
    body('completed')
        .isBoolean()
        .withMessage('Completed must be a boolean value.'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];