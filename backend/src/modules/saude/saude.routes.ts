import { Router } from 'express';
import { saudeController } from './saude.controller.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/aso', saudeController.listASOs);
router.get('/exames', saudeController.listExames);
router.get('/cat', saudeController.listCATs);

export const saudeRoutes = router;
