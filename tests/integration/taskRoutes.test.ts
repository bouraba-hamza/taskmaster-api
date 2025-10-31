import request from 'supertest';
import app from '../../src/app';
import { Task } from '../../src/models/task';

describe('Task Routes', () => {
  let taskId: number;

  beforeAll(async () => {
    // Create a task to test against
    const response = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        completed: false,
      });
    taskId = response.body.id;
  });

  afterAll(async () => {
    // Clean up: delete the created task
    await request(app).delete(`/api/tasks/${taskId}`);
  });

  it('should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({
        title: 'New Task',
        description: 'Task description',
        completed: false,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('New Task');
  });

  it('should get all tasks', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a task by id', async () => {
    const response = await request(app).get(`/api/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', taskId);
  });

  it('should update a task', async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({
        title: 'Updated Task',
        description: 'Updated description',
        completed: true,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Updated Task');
  });

  it('should delete a task', async () => {
    const response = await request(app).delete(`/api/tasks/${taskId}`);

    expect(response.status).toBe(204);
  });


});