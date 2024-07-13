import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { Address, Contact } from '@prisma/client';

describe('Address Controller', () => {
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

  describe('POST /api/contacts/:contactId/addresses', () => {
    let contact;
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      contact = await testService.createContact();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postalCode: '',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if the authorization is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .send({
          street: 'test',
          city: 'test',
          province: 'test',
          country: 'test',
          postalCode: 'test',
        })
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if contact is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id + 1}/addresses`)
        .send({
          street: 'test',
          city: 'tes',
          province: 'test',
          country: 'test',
          postalCode: 'test',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create address', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .send({
          street: 'test',
          city: 'tes',
          province: 'test',
          country: 'test',
          postalCode: 'test',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.street).toBeDefined();
      expect(response.body.data.city).toBeDefined();
      expect(response.body.data.province).toBeDefined();
      expect(response.body.data.country).toBeDefined();
      expect(response.body.data.postalCode).toBeDefined();
    });
  });

  describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    let contact: Contact;
    let address: Address;
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      contact = await testService.createContact();
      address = await testService.createAddress(contact.id);
    });

    it('should be rejected if the authorization is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if contact is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if address is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get address', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBeDefined();
      expect(response.body.data.city).toBeDefined();
      expect(response.body.data.province).toBeDefined();
      expect(response.body.data.country).toBeDefined();
      expect(response.body.data.postalCode).toBeDefined();
    });
  });

  describe('PUT /api/contacts/:contactId/addresses/:contactId', () => {
    let contact;
    let address;
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      contact = await testService.createContact();
      address = await testService.createAddress(contact.id);
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postalCode: '',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if the authorization is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .send({
          street: 'test edit',
          city: 'test edit',
          province: 'test edit',
          country: 'test edit',
          postalCode: 'test edit',
        })
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if contact is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .send({
          street: 'test edit',
          city: 'test edit',
          province: 'test edit',
          country: 'test edit',
          postalCode: 'test edit',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if address is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .send({
          street: 'test edit',
          city: 'test edit',
          province: 'test edit',
          country: 'test edit',
          postalCode: 'test edit',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update address', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .send({
          street: 'test edit',
          city: 'test edit',
          province: 'test edit',
          country: 'test edit',
          postalCode: 'test edit',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBe('test edit');
      expect(response.body.data.city).toBe('test edit');
      expect(response.body.data.province).toBe('test edit');
      expect(response.body.data.country).toBe('test edit');
      expect(response.body.data.postalCode).toBe('test edit');
    });
  });

  describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    let contact: Contact;
    let address: Address;
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      contact = await testService.createContact();
      address = await testService.createAddress(contact.id);
    });

    it('should be rejected if the authorization is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if contact is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if address is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete address', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/contacts/:contactId/addresses', () => {
    let contact: Contact;
    let address: Address;
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      contact = await testService.createContact();
      address = await testService.createAddress(contact.id);
    });

    it('should be rejected if the authorization is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if contact is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get list address', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data[0].street).toBeDefined();
      expect(response.body.data[0].city).toBeDefined();
      expect(response.body.data[0].province).toBeDefined();
      expect(response.body.data[0].country).toBeDefined();
      expect(response.body.data[0].postalCode).toBeDefined();
    });
  });
});
