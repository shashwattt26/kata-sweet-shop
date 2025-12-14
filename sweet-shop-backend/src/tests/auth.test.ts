import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../data-source';

// Setup DB before tests
beforeAll(async () => {
    await AppDataSource.initialize();
});

// Teardown DB after tests
afterAll(async () => {
    await AppDataSource.destroy();
});

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'securepassword'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });
});