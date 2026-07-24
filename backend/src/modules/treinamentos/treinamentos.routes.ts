import { Router } from 'express';
import { treinamentosController } from './treinamentos.controller.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', treinamentosController.listCursos);
router.get('/realizados', treinamentosController.listRealizados);

export const treinamentosRoutes = router;
