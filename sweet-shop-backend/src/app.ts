import express from 'express';
import authRoutes from './routes/authRoutes';
import sweetsRoutes from './routes/sweetsRoutes'; // Import this
import { AppDataSource } from './data-source';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes); // Add this line


// Initialize DB connection (if not in test mode, usually)
// For Jest, we usually initialize inside the test or a setup file, 
// but for simplicity in this specific Kata step, we will check env.
if (process.env.NODE_ENV !== 'test') {
    AppDataSource.initialize()
        .then(() => console.log("Database connected"))
        .catch(error => console.log(error));
}

export default app;