import { Router } from 'express';
import { materiaisController } from './materiais.controller.js';
import { authMiddleware } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { createMaterialSchema, updateMaterialSchema, attachMaterialToOsSchema } from './materiais.schema.js';

const router = Router();

router.use(authMiddleware);

router.get('/', materiaisController.list);
router.get('/:id', materiaisController.getById);
router.post('/', validate(createMaterialSchema), materiaisController.create);
router.patch('/:id', validate(updateMaterialSchema), materiaisController.update);
router.delete('/:id', materiaisController.delete);

router.post('/:id/os/:osId', validate(attachMaterialToOsSchema), materiaisController.attachToOs);

router.get('/os/:osId', materiaisController.listByOs);

export const materiaisRoutes = router;
