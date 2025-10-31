import express from 'express';
import { json } from 'body-parser';
import { setRoutes } from './routes/taskRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { loggerMiddleware } from './utils/logger';

const app = express();

// Middleware
app.use(json());
app.use(loggerMiddleware);

// Set up routes
setRoutes(app);

// Error handling middleware
app.use(errorHandler);

export default app;