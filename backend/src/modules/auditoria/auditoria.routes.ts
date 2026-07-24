import { Router } from 'express';
import { auditoriaController } from './auditoria.controller.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', auditoriaController.list);

export const auditoriaRoutes = router;
