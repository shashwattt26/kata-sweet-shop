import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { Sweet } from '../entity/Sweet';

let authToken: string;

beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.getRepository(User).clear();
    await AppDataSource.getRepository(Sweet).clear();

    // 1. Create a user to get a token
    await request(app).post('/api/auth/register').send({
        username: 'adminuser',
        password: 'adminpassword'
    });

    const res = await request(app).post('/api/auth/login').send({
        username: 'adminuser',
        password: 'adminpassword'
    });

    authToken = res.body.token;
});

afterAll(async () => {
    await AppDataSource.destroy();
});

describe('Sweets Endpoints', () => {
    it('should add a new sweet (Protected)', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`) // Send Token
            .send({
                name: 'Chocolate Lava Cake',
                category: 'Cakes',
                price: 5.50,
                quantity: 10
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Sweet added successfully');
    });
});