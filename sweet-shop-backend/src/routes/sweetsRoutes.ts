import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { addSweet, getAllSweets, updateSweet, deleteSweet } from '../controllers/sweetsController';
import { isAdmin } from '../middleware/adminMiddleware';

const router = Router();

// Apply middleware to protect this route
router.post('/', authenticateToken, addSweet);
router.get('/', authenticateToken, getAllSweets);
router.put('/:id', authenticateToken, updateSweet);
router.delete('/:id', authenticateToken, deleteSweet);

export default router;