import { Router, Application } from 'express';
import { TaskController } from '../controllers/taskController';
import { validateTask } from '../validators/taskValidator';

const router = Router();
const taskController = new TaskController();

export const setRoutes = (app: Application) => {
    router.post('/tasks', validateTask, taskController.createTask);
    router.get('/tasks', taskController.getAllTasks);
    router.get('/tasks/:id', taskController.getTaskById);
    router.put('/tasks/:id', validateTask, taskController.updateTask);
    router.delete('/tasks/:id', taskController.deleteTask);

    app.use('/api', router);
};