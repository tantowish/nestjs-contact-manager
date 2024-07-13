import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('User Controller', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/users', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.username).toBeDefined();
      expect(response.body.data.name).toBeDefined();
    });

    it('should be rejected if username already exist', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBeDefined();
      expect(response.body.data.name).toBeDefined();
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('GET /api/users', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBeDefined();
      expect(response.body.data.name).toBeDefined();
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('PATCH /api/users', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users')
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users')
        .set('Authorization', 'test')
        .send({
          name: 'test edit',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update user', async () => {
      let response = await request(app.getHttpServer())
        .patch('/api/users')
        .set('Authorization', 'test')
        .send({
          name: 'test edit',
          password: 'test edit',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test edit');
      expect(response.body.data.token).toBeDefined();

      response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test edit',
        });
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBeDefined();
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('DELETE /api/users', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users')
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to logout user', async () => {
      let response = await request(app.getHttpServer())
        .delete('/api/users')
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBeDefined();
      expect(response.body.data.name).toBeDefined();
    });
  });
});
