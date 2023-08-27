import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ApiRoutes } from '../../src/constants/ApiRoutes';
import { MongooseConnections } from '../utils/MongooseConnections';

describe('Auth', () => {
  let app: INestApplication;
  const originalEnv = process.env;

  beforeAll(async () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'TEST',
      JWT_SECRET: 'muito_secreto',
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  }, 2000);

  afterAll(async () => {
    jest.restoreAllMocks();
    process.env = originalEnv;
    await app.close();
  }, 2000);

  describe('Testing /auth route', () => {
    let token: string;
    const mongooseConnections = new MongooseConnections();
    const fakeUser = {
      username: 'Jonh Doe',
      password: 'minhaIncrivelSenha1',
    };

    beforeAll(async () => {
      await request(app.getHttpServer()).post('/user/register').send(fakeUser);

      const { body } = await request(app.getHttpServer())
        .post('/user/login')
        .send(fakeUser);

      token = body.token;
    }, 2000);

    afterAll(async () => {
      await mongooseConnections.remove('users');
    }, 2000);

    it('GET /auth/verify testing if return false with invalid token', async () => {
      const invalidToken = 'invalid';

      const { body, status } = await request(app.getHttpServer())
        .get(ApiRoutes.AUTH_VERIFY)
        .set('Authorization', invalidToken);

      expect(status).toBe(200);
      expect(body.authorized).toBeDefined();
      expect(body.authorized).toBe(false);
    });

    it('GET /auth/verify testing if return true with valid token', async () => {
      const { body, status } = await request(app.getHttpServer())
        .get(ApiRoutes.AUTH_VERIFY)
        .set('Authorization', token);

      expect(status).toBe(200);
      expect(body.authorized).toBeDefined();
      expect(body.authorized).toBe(true);
    });
  });

  describe('Testing Auth in history routes', () => {
    describe('Testing GET /users/history', () => {
      it('Testing if try acess without permission return a error', async () => {
        const { body, status } = await request(app.getHttpServer()).get(
          ApiRoutes.USER_HISTORY,
        );

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Token not found');
      });

      it('Testing if try acess with invalid token return a error', async () => {
        const invalidToken = 'invalid';

        const { body, status } = await request(app.getHttpServer())
          .get(ApiRoutes.USER_HISTORY)
          .set('Authorization', invalidToken);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Expired or invalid token');
      });
    });

    describe('Testing POST /users/history', () => {
      it('Testing if try acess without permission return a error', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post(ApiRoutes.USER_HISTORY)
          .send({ waxing_time: '2023-08-27T13:36:12.654Z' });

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Token not found');
      });

      it('Testing if try acess with invalid token return a error', async () => {
        const invalidToken = 'invalid';

        const { body, status } = await request(app.getHttpServer())
          .post(ApiRoutes.USER_HISTORY)
          .send({ waxing_time: '2023-08-27T13:36:12.654Z' })
          .set('Authorization', invalidToken);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Expired or invalid token');
      });
    });
  });
});
