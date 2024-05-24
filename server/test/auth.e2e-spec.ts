import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AssignorService } from 'src/assignor/assignor.service';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { UserDto } from 'src/auth/UserDto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('Auth', () => {
  let app: INestApplication;

  const entity = {
    id: randomUUID(),
  };

  const assignorService = {
    retrieve: (_: string) => entity,
  };

  const prismaUserService = () => {
    const users = new Map();

    return {
      user: {
        create: async (data: {data:UserDto}) => {
          users.set(data.data.login, data.data);
          return data;
        },
        findFirst: async (where: { where: { login: string } }) => {
          return users.get(where.where.login);
        },
        count: async (where: {login: string}) => {
          if (users.has(where.login)) return 1;
          return 0;
        },
      },
    };
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AssignorService)
      .useValue(assignorService)
      .overrideProvider(PrismaService)
      .useValue(prismaUserService())
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('GET /integrations/assignor/id with no auth', () => {
    return request(app.getHttpServer())
      .get(`/integrations/assignor/${entity.id}`)
      .expect(403);
  });

  it('Authorization flow', async () => {
    const client = request(app.getHttpServer());
    const registerResponse = await client
      .post('/integrations/auth/register')
      .set('Content-Type', 'application/json')
      .send({ login: 'aprovame', password: 'aprovame' });
    expect(registerResponse.statusCode).toBe(HttpStatus.CREATED);
    const { body, statusCode } = await client
      .post('/integrations/auth')
      .send({ login: 'aprovame', password: 'aprovame' })
      .set('Content-Type', 'application/json');
    expect(statusCode).toBe(HttpStatus.CREATED);
    const { accessToken } = body;
    const response = await client
      .get(`/integrations/assignor/${entity.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toEqual(entity);
  });
});
