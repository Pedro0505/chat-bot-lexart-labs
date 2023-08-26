import { Test, TestingModule } from '@nestjs/testing';
import { MongooseConnections } from '../utils/MongooseConnections';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { usersMock } from '../mock/data';
import { ApiRoutes } from '../../src/constants/ApiRoutes';

describe('Testing Users Route (e2e)', () => {
  let app: INestApplication;
  const originalEnv = process.env;
  const mongooseConnections = new MongooseConnections();

  beforeAll(async () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'TEST',
      OWNER_KEY: 'secreto',
      JWT_SECRET: 'muito_secreto',
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    process.env = originalEnv;
    await mongooseConnections.remove('users');
    await app.close();
  });

  describe('Testing /user/register POST', () => {
    const fakeUser = {
      username: 'Jonh Doe',
      password: 'minhaIncrivelSenha1',
    };

    afterAll(async () => {
      await mongooseConnections.remove('users');
    });

    it('Testing when successfully register', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(ApiRoutes.USER_REGISTER)
        .send({ username: 'Pedro', password: 'mimhaSenha2' });

      expect(status).toBe(201);
      expect(body.token).toBeDefined();
      expect(() => {
        jwt.verify(body.token, process.env.JWT_SECRET);
      }).not.toThrow();

      await mongooseConnections.remove('users');
    });

    it('Testing when trying to create a user that already exists', async () => {
      await request(app.getHttpServer())
        .post(ApiRoutes.USER_REGISTER)
        .send(fakeUser);

      const { body, status } = await request(app.getHttpServer())
        .post(ApiRoutes.USER_REGISTER)
        .send(fakeUser);

      expect(status).toBe(409);
      expect(body.message).toBeDefined();
      expect(body.message).toBe('Usuário já existe');
    });
  });

  describe('Testing /user/login POST', () => {
    beforeAll(async () => {
      await mongooseConnections.insert('users', usersMock);
    });

    afterAll(async () => {
      await mongooseConnections.remove('users');
    });

    it('Testing when successfully login', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(ApiRoutes.USER_LOGIN)
        .send({
          username: usersMock[0].username,
          password: '12345678A',
        });

      expect(status).toBe(201);
      expect(body.token).toBeDefined();
      expect(() => {
        jwt.verify(body.token, process.env.JWT_SECRET);
      }).not.toThrow();
    });

    it('Testing when trying to login a user that not exists', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(ApiRoutes.USER_LOGIN)
        .send({ username: 'Pedro', password: 'minhaSenha1' });

      expect(status).toBe(401);
      expect(body.message).toBeDefined();
      expect(body.message).toBe('Usuário não cadastrado');
    });

    it('Testing when trying to login a user using wrong password', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(ApiRoutes.USER_LOGIN)
        .send({ username: 'jonh_doe', password: 'senhaNova1' });

      expect(status).toBe(401);
      expect(body.message).toBeDefined();
      expect(body.message).toBe('Usuário ou senha incorreta');
    });
  });

  describe('Testing /user/history POST', () => {
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

    it('Testing when successfully create a history', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(ApiRoutes.USER_HISTORY)
        .set({ Authorization: token })
        .send({ waxing_time: new Date() });

      expect(status).toBe(201);
      expect(body.username).toBe(fakeUser.username);
      expect(body.conversations).toBeDefined();
      expect(Array.isArray(body.conversations)).toBeTruthy();
      expect(body.conversations).toHaveLength(1);
    });
  });

  describe('Testing /user/history GET', () => {
    const fakeUser = {
      username: usersMock[0].username,
      password: '12345678A',
    };
    let token: string;
    const mongooseConnections = new MongooseConnections();

    beforeAll(async () => {
      await mongooseConnections.insert('users', usersMock);

      const { body } = await request(app.getHttpServer())
        .post('/user/login')
        .send(fakeUser);

      token = body.token;
    }, 2000);

    afterAll(async () => {
      await mongooseConnections.remove('users');
    }, 2000);

    it('Testing when successfully get a history', async () => {
      const { body, status } = await request(app.getHttpServer())
        .get(ApiRoutes.USER_HISTORY)
        .set({ Authorization: token });

      expect(status).toBe(200);
      expect(Array.isArray(body)).toBeTruthy();
      expect(body).toHaveLength(1);
    });
  });
});
