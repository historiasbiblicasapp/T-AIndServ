import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authMiddleware } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { loginSchema, registerSchema } from './auth.schema.js';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.register);
router.post('/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, authController.profile);
router.post('/refresh', authController.refresh);

export const authRoutes = router;
