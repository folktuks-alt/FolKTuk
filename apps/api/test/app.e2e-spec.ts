import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

const runE2e = process.env.RUN_API_E2E === 'true';

(runE2e ? describe : describe.skip)('API authentication e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(() => app.close());

  it('signs up and logs in a user, then protects the activity resource', async () => {
    const suffix = Date.now();
    const email = `e2e-${suffix}@example.com`;
    const password = 'Password123!';
    await request(app.getHttpServer())
      .post('/identity/signup')
      .send({ email, password, username: `e2e${suffix}`, displayName: 'E2E User' })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/identity/login')
      .send({ identifier: email, password })
      .expect(201);

    expect(login.body.accessToken).toEqual(expect.any(String));
    await request(app.getHttpServer()).get('/users/me/activity').expect(401);
    await request(app.getHttpServer())
      .get('/users/me/activity')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .expect(200);
  });
});
