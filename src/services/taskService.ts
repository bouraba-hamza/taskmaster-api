import { Task } from '../models/task';

export class TaskService {
    private tasks: Map<number, Task>;
    private nextId: number;

    constructor() {
        this.tasks = new Map();
        this.nextId = 1;
    }

    createTask(title: string, description: string): Task {
        const newTask: Task = {
            id: this.nextId,
            title,
            description,
            completed: false,
        };
        this.tasks.set(this.nextId, newTask);
        this.nextId++;
        return newTask;
    }

    getAllTasks(): Task[] {
        return Array.from(this.tasks.values());
    }

    getTaskById(id: number): Task | null {
        return this.tasks.get(id) || null;
    }

    updateTask(id: number, updatedData: Partial<Task>): Task | null {
        const task = this.tasks.get(id);
        if (!task) {
            return null;
        }
        const updatedTask = { ...task, ...updatedData };
        this.tasks.set(id, updatedTask);
        return updatedTask;
    }

    deleteTask(id: number): boolean {
        return this.tasks.delete(id);
    }
}