/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';

beforeEach(async () => {
  await connection.query('DELETE FROM sessions; DELETE FROM clients');
});

afterAll(() => {
  connection.end();
});

const agent = supertest(app);

describe('POST /signup', () => {
  it('should returns status 201 when data is ok', async () => {
    const body = {
      name: 'Test',
      email: 'test@email.com',
      password: '123456',
      confirmPassword: '123456',
    };

    const result = await agent.post('/signup').send(body);
    expect(result.status).toEqual(201);
  });

  it('should returns status 400 when body has any data as invalid', async () => {
    const body = {
      name: 'Test',
      email: 'test',
      password: '123456',
      confirmPassword: '123456',
    };

    const result = await agent.post('/signup').send(body);
    expect(result.status).toEqual(400);
  });

  it('should returns status 400 when body is empty', async () => {
    const body = {};

    const result = await agent.post('/signup').send(body);
    expect(result.status).toEqual(400);
  });

  it('should returns status 409 when email is already registered', async () => {
    const body = {
      name: 'Test',
      email: 'test@email.com',
      password: '123456',
      confirmPassword: '123456',
    };

    await agent.post('/signup').send(body);
    const result = await agent.post('/signup').send(body);
    expect(result.status).toEqual(409);
  });
});

describe('POST /login', () => {
  beforeEach(async () => {
    const body = {
      name: 'Test',
      email: 'test@email.com',
      password: '123456',
      confirmPassword: '123456',
    };
    await agent.post('/signup').send(body);
  });

  it('should returns status 400 when login data is invalid', async () => {
    const body = {
      email: 'test@email.com',
      password: '12',
    };

    const result = await agent.post('/login').send(body);
    expect(result.status).toEqual(400);
  });

  it("should returns status 401 when email doesn't exists", async () => {
    const body = {
      email: 'test@ema.com',
      password: '123456',
    };

    const result = await agent.post('/login').send(body);
    expect(result.status).toEqual(401);
  });

  it('should returns status 401 when password is incorrect', async () => {
    const body = {
      email: 'test@email.com',
      password: '1234567',
    };

    const result = await agent.post('/login').send(body);
    expect(result.status).toEqual(401);
  });

  it('should returns status 200 when email and password are ok', async () => {
    const body = {
      email: 'test@email.com',
      password: '123456',
    };

    const result = await agent.post('/login').send(body);
    expect(result.status).toEqual(200);
  });
});
