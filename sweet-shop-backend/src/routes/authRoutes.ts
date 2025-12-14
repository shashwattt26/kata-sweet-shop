import { Router } from 'express';
import { register, login } from '../controllers/authController'; // Import login

const router = Router();

router.post('/register', register);
router.post('/login', login); // Add this line

export default router;