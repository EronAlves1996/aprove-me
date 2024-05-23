import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AssignorService } from 'src/assignor/assignor.service';
import { randomUUID } from 'crypto';
import * as request from 'supertest';

describe('Auth', () => {
  let app: INestApplication;
  const entity = {
    id: randomUUID(),
  };
  const assignorService = {
    retrieve: (_: string) => entity,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AssignorService)
      .useValue(assignorService)
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
