export class TaskRepository {
    private tasks: Map<number, { id: number; title: string; description: string; completed: boolean }>;
    private nextId: number;

    constructor() {
        this.tasks = new Map();
        this.nextId = 1;
    }

    public createTask(title: string, description: string): { id: number; title: string; description: string; completed: boolean } {
        const task = { id: this.nextId, title, description, completed: false };
        this.tasks.set(this.nextId, task);
        this.nextId++;
        return task;
    }

    public getAllTasks(): Array<{ id: number; title: string; description: string; completed: boolean }> {
        return Array.from(this.tasks.values());
    }

    public getTaskById(id: number): { id: number; title: string; description: string; completed: boolean } | undefined {
        return this.tasks.get(id);
    }

    public updateTask(id: number, title?: string, description?: string, completed?: boolean): { id: number; title: string; description: string; completed: boolean } | undefined {
        const task = this.tasks.get(id);
        if (task) {
            if (title !== undefined) task.title = title;
            if (description !== undefined) task.description = description;
            if (completed !== undefined) task.completed = completed;
            return task;
        }
        return undefined;
    }

    public deleteTask(id: number): boolean {
        return this.tasks.delete(id);
    }
}