import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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

  it('/GET /integrations/assignor/id with no auth', () => {
    return request(app.getHttpServer())
      .get(`/integrations/assignor/${entity.id}`)
      .expect(403);
  });
});
