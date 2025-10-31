import { TaskService } from '../../src/services/taskService';
import { Task } from '../../src/models/task';

describe('TaskService', () => {
    let taskService: TaskService;

    beforeEach(() => {
        taskService = new TaskService();
    });

    it('should create a new task', () => {
        const title = 'Test Task';
        const description = 'This is a test task';

        const createdTask = taskService.createTask(title, description);
        expect(createdTask).toHaveProperty('id');
        expect(createdTask.title).toBe(title);
        expect(createdTask.description).toBe(description);
        expect(createdTask.completed).toBe(false);
        
        const tasks = taskService.getAllTasks();
        expect(tasks).toContainEqual(createdTask);
    });

    it('should retrieve all tasks', () => {
        const task1 = taskService.createTask('Test Task 1', 'This is test task 1');
        const task2 = taskService.createTask('Test Task 2', 'This is test task 2');

        const tasks = taskService.getAllTasks();
        expect(tasks).toHaveLength(2);
        expect(tasks).toContainEqual(task1);
        expect(tasks).toContainEqual(task2);
    });

    it('should retrieve a task by id', () => {
        const createdTask = taskService.createTask('Test Task', 'This is a test task');
        const taskId = createdTask.id;

        const retrievedTask = taskService.getTaskById(taskId);
        expect(retrievedTask).toEqual(createdTask);
    });

    it('should update a task', () => {
        const createdTask = taskService.createTask('Test Task', 'This is a test task');
        const taskId = createdTask.id;

        const updatedData = { title: 'Updated Task', description: 'Updated description', completed: true };
        const updatedTask = taskService.updateTask(taskId, updatedData);

        expect(updatedTask).toBeTruthy();
        expect(updatedTask?.title).toBe('Updated Task');
        expect(updatedTask?.completed).toBe(true);
    });

    it('should delete a task', () => {
        const createdTask = taskService.createTask('Test Task', 'This is a test task');
        const taskId = createdTask.id;

        const deleteResult = taskService.deleteTask(taskId);
        expect(deleteResult).toBe(true);
        
        const retrievedTask = taskService.getTaskById(taskId);
        expect(retrievedTask).toBeNull();
    });

    it('should return null for a non-existing task', () => {
        const task = taskService.getTaskById(999);
        expect(task).toBeNull();
    });

    it('should return false when deleting non-existing task', () => {
        const deleteResult = taskService.deleteTask(999);
        expect(deleteResult).toBe(false);
    });

    it('should return null when updating non-existing task', () => {
        const updatedTask = taskService.updateTask(999, { title: 'Updated' });
        expect(updatedTask).toBeNull();
    });
});