import { Request, Response, NextFunction } from 'express';
import { validateTask } from '../validators/taskValidator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const { error } = validateTask(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};