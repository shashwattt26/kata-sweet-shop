import express from 'express';
import authRoutes from './routes/authRoutes';
import { AppDataSource } from './data-source';

const app = express();
app.use(express.json());

// Connect Routes
app.use('/api/auth', authRoutes);

// Initialize DB connection (if not in test mode, usually)
// For Jest, we usually initialize inside the test or a setup file, 
// but for simplicity in this specific Kata step, we will check env.
if (process.env.NODE_ENV !== 'test') {
    AppDataSource.initialize()
        .then(() => console.log("Database connected"))
        .catch(error => console.log(error));
}

export default app;