export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    completed?: boolean;
}