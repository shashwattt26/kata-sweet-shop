import { Router } from 'express';
import { addSweet } from '../controllers/sweetsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Apply middleware to protect this route
router.post('/', authenticateToken, addSweet);

export default router;