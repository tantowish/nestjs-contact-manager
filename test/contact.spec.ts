import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Contact Controller', () => {
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

  describe('POST /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .send({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if the authorization is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .send({
          firstName: 'test',
          lastName: 'test',
          email: 'test@gmail.com',
          phone: '0811111',
        })
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create contact', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .send({
          firstName: 'test',
          lastName: 'test',
          email: 'test@gmail.com',
          phone: '0811111',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.firstName).toBeDefined();
      expect(response.body.data.lastName).toBeDefined();
      expect(response.body.data.email).toBeDefined();
      expect(response.body.data.phone).toBeDefined();
    });
  });

  describe('GET /api/contacts/:contactId', () => {
    let contact;
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      contact = await testService.createContact();
    });

    it('should be rejected if id is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if the authorization is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get contact', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.firstName).toBeDefined();
      expect(response.body.data.lastName).toBeDefined();
      expect(response.body.data.email).toBeDefined();
      expect(response.body.data.phone).toBeDefined();
    });
  });

  describe('PUT /api/contacts/:contactId', () => {
    let contact;
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      contact = await testService.createContact();
    });

    it('should be rejected if id is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}`)
        .send({
          firstName: 'test edit',
          lastName: 'test edit',
          email: 'test@gmail.com',
          phone: '0811111',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .send({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if the authorization is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .send({
          firstName: 'test edit',
          lastName: 'test edit',
          email: 'test@gmail.com',
          phone: '0811111',
        })
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update contact', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .send({
          firstName: 'test edit',
          lastName: 'test edit',
          email: 'test@gmail.com',
          phone: '0822222',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.firstName).toBe('test edit');
      expect(response.body.data.lastName).toBe('test edit');
      expect(response.body.data.email).toBe('test@gmail.com');
      expect(response.body.data.phone).toBe('0822222');
    });
  });

  describe('Delete /api/contacts/:contactId', () => {
    let contact;
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      contact = await testService.createContact();
    });

    it('should be rejected if id is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if the authorization is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}`)
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get contact', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/contacts', () => {
    let contact;
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      contact = await testService.createContact();
    });

    it('should be rejected if the authorization is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to search contacts by name', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/`)
        .query({
          name: 'es',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts by name not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/`)
        .query({
          name: 'wrong',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts by email', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/`)
        .query({
          email: 'test@',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts by email not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/`)
        .query({
          email: 'wrong@',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts by phone', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/`)
        .query({
          phone: '08111',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts by phone not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/`)
        .query({
          phone: '08222',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts with page', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          size: 1,
          page: 2,
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.currentPage).toBe(2);
      expect(response.body.paging.totalPage).toBe(1);
      expect(response.body.paging.size).toBe(1);
    });
  });
});
