import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let workspaceId: string;
  let projectId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();

    // Create test user and get token
    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'tasktest@example.com',
        password: 'Test123!',
        firstName: 'Task',
        lastName: 'Tester',
      });

    authToken = registerRes.body.token;

    // Create workspace
    const workspaceRes = await request(app.getHttpServer())
      .post('/api/workspaces')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Workspace' });

    workspaceId = workspaceRes.body.id;

    // Create project
    const projectRes = await request(app.getHttpServer())
      .post('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Project',
        workspaceId,
      });

    projectId = projectRes.body.id;
  });

  afterAll(async () => {
    await prisma.task.deleteMany({ where: { projectId } });
    await prisma.project.deleteMany({ where: { id: projectId } });
    await prisma.workspace.deleteMany({ where: { id: workspaceId } });
    await prisma.user.deleteMany({ where: { email: 'tasktest@example.com' } });
    await app.close();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          projectId,
          workspaceId,
          priority: 'high',
        })
        .expect(201);

      expect(response.body.title).toBe('Test Task');
      expect(response.body.priority).toBe('high');
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks for project', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/tasks?projectId=${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
