import { Router } from 'express';
import { feriasController } from './ferias.controller.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', feriasController.list);

export const feriasRoutes = router;
