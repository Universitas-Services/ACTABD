// src/app.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    // 👇 2. Añade el tipo 'Response' a la constante
    // 3. Ahora, TypeScript entiende correctamente el tipo 'Response'.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const response = await request(app.getHttpServer()).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });

  afterAll(async () => {
    await app.close();
  });
});
