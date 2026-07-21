import { Router } from 'express';
import { osController } from './os.controller.js';
import { authMiddleware } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { createOSSchema, updateOSSchema, updateStatusOSSchema } from './os.schema.js';

const router = Router();

router.use(authMiddleware);

router.get('/', osController.list);
router.get('/:id', osController.getById);
router.post('/', validate(createOSSchema), osController.create);
router.patch('/:id', validate(updateOSSchema), osController.update);
router.patch('/:id/status', validate(updateStatusOSSchema), osController.updateStatus);
router.post('/:id/historico', osController.addHistorico);
router.get('/:id/historico', osController.getHistorico);

export const osRoutes = router;
