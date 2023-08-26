import { Test, TestingModule } from '@nestjs/testing';
import { MongooseConnections } from '../utils/MongooseConnections';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { usersMock } from '../mock/data';
import { ApiRoutes } from '../../src/constants/ApiRoutes';
import SerializeBody from '../utils/SerializeBody';

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

    describe('Testing body validations error', () => {
      const userValidator = {
        username: 'Test User',
        password: '12345678A',
      };
      const serializeBodyCreate = new SerializeBody(userValidator);

      describe('Testing field "username"', () => {
        it('Testing if name is not a string', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_REGISTER)
            .send(serializeBodyCreate.changeKeyValue('username', 1));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'O nome de usuário precisa ser uma strig',
          );
        });

        it('Testing if name is not a string', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_REGISTER)
            .send(serializeBodyCreate.removeKey('username'));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'O nome de usuário não pode ser vazio',
          );
        });

        it("Testing if name isn't empty", async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_REGISTER)
            .send(serializeBodyCreate.changeKeyValue('username', ''));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'O nome de usuário não pode ser vazio',
          );
        });

        it('Testing if name have length more than 50', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_REGISTER)
            .send(serializeBodyCreate.repeatChar('username', 15));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'O nome de usuário precisa ter entre 1 e 50 caracteres',
          );
        });
      });

      describe('Testing field "password"', () => {
        it('Testing if password is not a string', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_REGISTER)
            .send(serializeBodyCreate.changeKeyValue('password', 1));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain('A senha precisa ser uma strig');
        });

        it('Testing if password is not a string', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_REGISTER)
            .send(serializeBodyCreate.removeKey('password'));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain('A senha não pode ser vazia');
        });

        it("Testing if password isn't empty", async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_REGISTER)
            .send(serializeBodyCreate.changeKeyValue('password', ''));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain('A senha não pode ser vazia');
        });

        it('Testing if password have length more than 50', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_REGISTER)
            .send(serializeBodyCreate.repeatChar('password', 15));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'A senha precisa ter entre 1 e 50 caracteres',
          );
        });

        it('Testing if password have space', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_REGISTER)
            .send(serializeBodyCreate.changeKeyValue('password', 'kasd1 das'));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'A senha não pode conter espaços em branco',
          );
        });

        it('Testing if password have at least one number', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_REGISTER)
            .send(serializeBodyCreate.changeKeyValue('password', 'kasddas'));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'A senha tem que conter ao menos um número',
          );
        });

        it('Testing if password have at least one letter', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_REGISTER)
            .send(serializeBodyCreate.changeKeyValue('password', '12345678'));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'A senha tem que conter ao menos uma letra',
          );
        });
      });
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

    describe('Testing body validations error', () => {
      const userValidator = {
        username: 'Test User',
        password: '12345678A',
      };
      const serializeBodyCreate = new SerializeBody(userValidator);

      describe('Testing field "username"', () => {
        it('Testing if name is not a string', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_LOGIN)
            .send(serializeBodyCreate.changeKeyValue('username', 1));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'O nome de usuário precisa ser uma strig',
          );
        });

        it('Testing if name is not a string', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_LOGIN)
            .send(serializeBodyCreate.removeKey('username'));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'O nome de usuário não pode ser vazio',
          );
        });

        it("Testing if name isn't empty", async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_LOGIN)
            .send(serializeBodyCreate.changeKeyValue('username', ''));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'O nome de usuário não pode ser vazio',
          );
        });

        it('Testing if name have length more than 50', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_LOGIN)
            .send(serializeBodyCreate.repeatChar('username', 15));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'O nome de usuário precisa ter entre 1 e 50 caracteres',
          );
        });
      });

      describe('Testing field "password"', () => {
        it('Testing if password is not a string', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_LOGIN)
            .send(serializeBodyCreate.changeKeyValue('password', 1));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain('A senha precisa ser uma strig');
        });

        it('Testing if password is not a string', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_LOGIN)
            .send(serializeBodyCreate.removeKey('password'));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain('A senha não pode ser vazia');
        });

        it("Testing if password isn't empty", async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_LOGIN)
            .send(serializeBodyCreate.changeKeyValue('password', ''));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain('A senha não pode ser vazia');
        });

        it('Testing if password have length more than 50', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_LOGIN)
            .send(serializeBodyCreate.repeatChar('password', 15));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'A senha precisa ter entre 1 e 50 caracteres',
          );
        });

        it('Testing if password have space', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_LOGIN)
            .send(serializeBodyCreate.changeKeyValue('password', 'kasd1 das'));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'A senha não pode conter espaços em branco',
          );
        });

        it('Testing if password have at least one number', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_LOGIN)
            .send(serializeBodyCreate.changeKeyValue('password', 'kasddas'));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'A senha tem que conter ao menos um número',
          );
        });

        it('Testing if password have at least one letter', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_LOGIN)
            .send(serializeBodyCreate.changeKeyValue('password', '12345678'));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'A senha tem que conter ao menos uma letra',
          );
        });
      });
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

    describe('Testing body validations error', () => {
      describe('Testing "waxing_time" field', () => {
        const serializeBodyCreate = new SerializeBody({
          waxing_time: new Date(),
        });

        it('Testing when waxing_time is not a valid date', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_HISTORY)
            .set({ Authorization: token })
            .send(
              serializeBodyCreate.changeKeyValue(
                'waxing_time',
                '2023-05-33T13:36:12.654Z',
              ),
            );

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'A data de enceramento tem que ser uma data válida',
          );
        });

        it('Testing if waxing_time is not a date', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_HISTORY)
            .set({ Authorization: token })
            .send(serializeBodyCreate.changeKeyValue('waxing_time', 1));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'A data de enceramento tem que ser uma data válida',
          );
        });

        it('Testing if waxing_time is not empty', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_HISTORY)
            .set({ Authorization: token })
            .send(serializeBodyCreate.changeKeyValue('waxing_time', ''));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'A data de enceramento não pode ser vazia',
          );
        });

        it('Testing if waxing_time is not undefined', async () => {
          const { body, status } = await request(app.getHttpServer())
            .post(ApiRoutes.USER_HISTORY)
            .set({ Authorization: token })
            .send(serializeBodyCreate.removeKey('waxing_time'));

          expect(status).toBe(400);
          expect(body.message).toBeDefined();
          expect(body.message).toContain(
            'A data de enceramento não pode ser vazia',
          );
        });
      });
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
