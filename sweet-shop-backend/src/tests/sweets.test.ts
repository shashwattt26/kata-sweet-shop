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

    it('should retrieve a list of sweets', async () => {
        // 1. Setup: Add a couple of sweets to the DB directly (or via API)
        const sweetRepo = AppDataSource.getRepository(Sweet);
        await sweetRepo.save([
            { name: 'Gummy Bears', category: 'Gummies', price: 2.50, quantity: 50 },
            { name: 'Dark Chocolate', category: 'Chocolate', price: 4.00, quantity: 20 }
        ]);

        // 2. Act: Call the GET endpoint
        const res = await request(app)
            .get('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`); // Assuming it's protected

        // 3. Assert
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        // We added 2 here + 1 from the previous test = 3 total
        expect(res.body.length).toBeGreaterThanOrEqual(2); 
    });

    it('should update an existing sweet', async () => {
        // 1. Setup: Create a sweet to update
        const sweetRepo = AppDataSource.getRepository(Sweet);
        const sweet = new Sweet();
        sweet.name = 'Old Name';
        sweet.category = 'Old Category';
        sweet.price = 1.00;
        sweet.quantity = 10;
        const savedSweet = await sweetRepo.save(sweet);

        // 2. Act: Send PUT request to update name and price
        const res = await request(app)
            .put(`/api/sweets/${savedSweet.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'New Name',
                price: 2.50
            });

        // 3. Assert
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Sweet updated successfully');
        
        // Verify in DB
        const updatedSweet = await sweetRepo.findOneBy({ id: savedSweet.id });
        expect(updatedSweet?.name).toEqual('New Name');
        expect(updatedSweet?.price).toEqual(2.50);
        expect(updatedSweet?.quantity).toEqual(10); // Should remain unchanged
    });
});

describe('Admin Only Endpoints', () => {
        it('should delete a sweet if user is Admin', async () => {
            // 1. Setup: Create a sweet to delete
            const sweetRepo = AppDataSource.getRepository(Sweet);
            const sweet = await sweetRepo.save({ 
                name: 'To Delete', category: 'Temp', price: 1, quantity: 1 
            });

            // 2. Setup: Promote our test user to 'admin' directly in DB
            // (In a real app, you'd have a seed script or super-admin endpoint)
            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOneBy({ username: 'adminuser' });
            if (user) {
                user.role = 'admin';
                await userRepo.save(user);
            }

            // 3. We need a NEW token because the role in the old token is stale ('user')
            const loginRes = await request(app).post('/api/auth/login').send({
                username: 'adminuser',
                password: 'adminpassword'
            });
            const adminToken = loginRes.body.token;

            // 4. Act: Delete
            const res = await request(app)
                .delete(`/api/sweets/${sweet.id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            // 5. Assert
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Sweet deleted successfully');
            
            // Verify it's gone
            const deletedSweet = await sweetRepo.findOneBy({ id: sweet.id });
            expect(deletedSweet).toBeNull();
        });
    });

describe('Inventory Endpoints', () => {
        it('should decrease quantity when purchasing a sweet', async () => {
            // 1. Setup: Create sweet with 10 items
            const sweetRepo = AppDataSource.getRepository(Sweet);
            const sweet = await sweetRepo.save({ 
                name: 'Candy Cane', category: 'Seasonal', price: 1.50, quantity: 10 
            });

            // 2. Act: Purchase 2 items
            const res = await request(app)
                .post(`/api/sweets/${sweet.id}/purchase`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ quantity: 2 });

            // 3. Assert
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Purchase successful');
            
            // Verify DB quantity is now 8
            const updatedSweet = await sweetRepo.findOneBy({ id: sweet.id });
            expect(updatedSweet?.quantity).toEqual(8);
        });

        it('should return 400 if insufficient stock', async () => {
            // 1. Setup: Create sweet with only 1 item
            const sweetRepo = AppDataSource.getRepository(Sweet);
            const sweet = await sweetRepo.save({ 
                name: 'Rare Candy', category: 'Rare', price: 100, quantity: 1 
            });

            // 2. Act: Try to purchase 5
            const res = await request(app)
                .post(`/api/sweets/${sweet.id}/purchase`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ quantity: 5 });

            // 3. Assert
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Insufficient stock');
        });

        it('should allow Admin to restock a sweet', async () => {
            // 1. Setup: Create sweet
            const sweetRepo = AppDataSource.getRepository(Sweet);
            const sweet = await sweetRepo.save({ 
                name: 'Empty Jar', category: 'Glass', price: 5.00, quantity: 0 
            });

            // 2. Setup: Promote user to Admin (reusing logic or assuming existing admin token)
            // Ideally, reuse the adminToken logic from the previous Admin test, 
            // OR re-login as admin here if scope is an issue.
            // Let's quickly re-login to be safe:
             const userRepo = AppDataSource.getRepository(User);
             const adminUser = await userRepo.findOneBy({ username: 'adminuser' });
             if (adminUser) {
                 adminUser.role = 'admin';
                 await userRepo.save(adminUser);
             }
            const resLogin = await request(app).post('/api/auth/login').send({
                username: 'adminuser',
                password: 'adminpassword'
            });
            const adminToken = resLogin.body.token;

            // 3. Act: Restock 50 items
            const res = await request(app)
                .post(`/api/sweets/${sweet.id}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ quantity: 50 });

            // 4. Assert
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Restock successful');
            
            const updatedSweet = await sweetRepo.findOneBy({ id: sweet.id });
            expect(updatedSweet?.quantity).toEqual(50);
        });

        it('should forbid non-admin from restocking', async () => {
            // 1. Setup: Create sweet
            const sweetRepo = AppDataSource.getRepository(Sweet);
            const sweet = await sweetRepo.save({ 
                name: 'Forbidden Cookie', category: 'Secret', price: 10, quantity: 0 
            });

            // 2. Act: Try to restock with regular authToken (from beforeAll)
            const res = await request(app)
                .post(`/api/sweets/${sweet.id}/restock`)
                .set('Authorization', `Bearer ${authToken}`) // This is the normal user token
                .send({ quantity: 10 });

            // 3. Assert
            expect(res.statusCode).toEqual(403);
        });
    });