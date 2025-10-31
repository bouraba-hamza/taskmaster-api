import { Request, Response } from 'express';
import { TaskController } from '../../src/controllers/taskController';
import { TaskService } from '../../src/services/taskService';

describe('TaskController', () => {
    let taskController: TaskController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockTaskService: jest.Mocked<TaskService>;

    beforeEach(() => {
        // Create mock TaskService
        mockTaskService = {
            createTask: jest.fn(),
            getAllTasks: jest.fn(),
            getTaskById: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
        } as any;

        taskController = new TaskController(mockTaskService);

        // Mock response object
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };

        // Mock request object
        mockRequest = {
            body: {},
            params: {},
        };
    });

    describe('createTask', () => {
        it('should create a task successfully', async () => {
            const taskData = { title: 'Test Task', description: 'Test Description' };
            const createdTask = { id: 1, ...taskData, completed: false };
            
            mockRequest.body = taskData;
            mockTaskService.createTask.mockReturnValue(createdTask);

            await taskController.createTask(mockRequest as Request, mockResponse as Response);

            expect(mockTaskService.createTask).toHaveBeenCalledWith('Test Task', 'Test Description');
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(createdTask);
        });

        it('should return 400 if title is missing', async () => {
            mockRequest.body = { description: 'Test Description' };

            await taskController.createTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Title is required and must be a string.' });
        });

        it('should return 400 if title is not a string', async () => {
            mockRequest.body = { title: 123, description: 'Test Description' };

            await taskController.createTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Title is required and must be a string.' });
        });

        it('should handle service errors', async () => {
            mockRequest.body = { title: 'Test Task', description: 'Test Description' };
            mockTaskService.createTask.mockImplementation(() => {
                throw new Error('Database error');
            });

            await taskController.createTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database error' });
        });
    });

    describe('getAllTasks', () => {
        it('should return all tasks', async () => {
            const tasks = [{ id: 1, title: 'Task 1', description: 'Desc 1', completed: false }];
            mockTaskService.getAllTasks.mockReturnValue(tasks);

            await taskController.getAllTasks(mockRequest as Request, mockResponse as Response);

            expect(mockTaskService.getAllTasks).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(tasks);
        });

        it('should handle service errors', async () => {
            mockTaskService.getAllTasks.mockImplementation(() => {
                throw new Error('Service error');
            });

            await taskController.getAllTasks(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Service error' });
        });
    });

    describe('getTaskById', () => {
        it('should return a task by id', async () => {
            const task = { id: 1, title: 'Task 1', description: 'Desc 1', completed: false };
            mockRequest.params = { id: '1' };
            mockTaskService.getTaskById.mockReturnValue(task);

            await taskController.getTaskById(mockRequest as Request, mockResponse as Response);

            expect(mockTaskService.getTaskById).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(task);
        });

        it('should return 400 for invalid id', async () => {
            mockRequest.params = { id: 'invalid' };

            await taskController.getTaskById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid task id' });
        });

        it('should return 404 if task not found', async () => {
            mockRequest.params = { id: '999' };
            mockTaskService.getTaskById.mockReturnValue(null);

            await taskController.getTaskById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
        });
    });

    describe('updateTask', () => {
        it('should update a task successfully', async () => {
            const updatedTask = { id: 1, title: 'Updated Task', description: 'Updated Desc', completed: true };
            mockRequest.params = { id: '1' };
            mockRequest.body = { title: 'Updated Task', completed: true };
            mockTaskService.updateTask.mockReturnValue(updatedTask);

            await taskController.updateTask(mockRequest as Request, mockResponse as Response);

            expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, { title: 'Updated Task', completed: true });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedTask);
        });

        it('should return 400 for invalid id', async () => {
            mockRequest.params = { id: 'invalid' };

            await taskController.updateTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid task id' });
        });

        it('should return 404 if task not found', async () => {
            mockRequest.params = { id: '999' };
            mockRequest.body = { title: 'Updated Task' };
            mockTaskService.updateTask.mockReturnValue(null);

            await taskController.updateTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
        });
    });

    describe('deleteTask', () => {
        it('should delete a task successfully', async () => {
            mockRequest.params = { id: '1' };
            mockTaskService.deleteTask.mockReturnValue(true);

            await taskController.deleteTask(mockRequest as Request, mockResponse as Response);

            expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it('should return 400 for invalid id', async () => {
            mockRequest.params = { id: 'invalid' };

            await taskController.deleteTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid task id' });
        });

        it('should return 404 if task not found', async () => {
            mockRequest.params = { id: '999' };
            mockTaskService.deleteTask.mockReturnValue(false);

            await taskController.deleteTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
        });
    });
});