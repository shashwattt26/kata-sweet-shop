import request from 'supertest';
import app from '../app';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

// Setup DB before tests
beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.getRepository(User).clear(); 
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
    it('should login an existing user and return a token', async () => {
        // 1. Setup: Register a user first
        await request(app).post('/api/auth/register').send({
            username: 'loginuser',
            password: 'password123'
        });

        // 2. Act: Try to login
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'loginuser',
                password: 'password123'
            });

        // 3. Assert: Check for token
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});