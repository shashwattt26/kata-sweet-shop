import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import sweetsRoutes from './routes/sweetsRoutes';
import { AppDataSource } from './data-source';

const app = express();
const PORT = 3000;

// 1. Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow frontend
    credentials: true
}));
app.use(express.json());

// 2. Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

// 3. Database Connection & Server Start
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
        
        // This is the part that keeps the server alive!
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => console.log(error));

export default app;