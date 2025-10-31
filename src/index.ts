import express from 'express';
import { json } from 'body-parser';
import { setRoutes } from './routes/taskRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { loggerMiddleware } from './utils/logger';
import { swaggerSetup } from './docs/swagger';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());
app.use(loggerMiddleware);

// Root route - API information
app.get('/', (req, res) => {
    res.json({
        name: 'TaskMaster API',
        version: '1.0.0',
        description: 'A RESTful API for task management',
        endpoints: {
            tasks: {
                'GET /api/tasks': 'Get all tasks',
                'POST /api/tasks': 'Create a new task',
                'GET /api/tasks/:id': 'Get a specific task',
                'PUT /api/tasks/:id': 'Update a task',
                'DELETE /api/tasks/:id': 'Delete a task'
            },
            documentation: 'GET /api-docs'
        },
        status: 'running'
    });
});

// Set up routes
setRoutes(app);

// Swagger documentation setup
swaggerSetup(app);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});