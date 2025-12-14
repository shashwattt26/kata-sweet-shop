import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { addSweet, getAllSweets, updateSweet } from '../controllers/sweetsController'; // Import it

const router = Router();

// Apply middleware to protect this route
router.post('/', authenticateToken, addSweet);
router.get('/', authenticateToken, getAllSweets);
router.put('/:id', authenticateToken, updateSweet);

export default router;