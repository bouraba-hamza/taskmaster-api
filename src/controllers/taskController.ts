import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { Task } from '../models/task';

export class TaskController {
    private taskService: TaskService;

    constructor(taskService?: TaskService) {
        this.taskService = taskService ?? new TaskService();
    }

    public createTask = (req: Request, res: Response): Response => {
        try {
            const { title, description } = req.body as Partial<Task>;
            if (!title || typeof title !== 'string') {
                return res.status(400).json({ message: 'Title is required and must be a string.' });
            }
            const newTask = this.taskService.createTask(title, description ?? '');
            return res.status(201).json(newTask);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ message });
        }
    };

    public getAllTasks = (req: Request, res: Response): Response => {
        try {
            const tasks = this.taskService.getAllTasks();
            return res.status(200).json(tasks);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ message });
        }
    };

    public getTaskById = (req: Request, res: Response): Response => {
        try {
            const taskId = parseInt(req.params.id, 10);
            if (Number.isNaN(taskId)) {
                return res.status(400).json({ message: 'Invalid task id' });
            }
            const task = this.taskService.getTaskById(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            return res.status(200).json(task);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ message });
        }
    };

    public updateTask = (req: Request, res: Response): Response => {
        try {
            const taskId = parseInt(req.params.id, 10);
            if (Number.isNaN(taskId)) {
                return res.status(400).json({ message: 'Invalid task id' });
            }
            const taskData = req.body;
            const updatedTask = this.taskService.updateTask(taskId, taskData);
            if (!updatedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
            return res.status(200).json(updatedTask);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ message });
        }
    };

    public deleteTask = (req: Request, res: Response): Response => {
        try {
            const taskId = parseInt(req.params.id, 10);
            if (Number.isNaN(taskId)) {
                return res.status(400).json({ message: 'Invalid task id' });
            }
            const deleted = this.taskService.deleteTask(taskId);
            if (!deleted) {
                return res.status(404).json({ message: 'Task not found' });
            }
            return res.status(204).send();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ message });
        }
    };
}