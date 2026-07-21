import { Router } from 'express';
import { usuariosController } from './usuarios.controller.js';
import { authMiddleware } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { updateUsuarioSchema, createUsuarioAdminSchema } from './usuarios.schema.js';

const router = Router();

router.use(authMiddleware);

router.get('/', usuariosController.list);
router.get('/roles', usuariosController.listRoles);
router.get('/roles/permissions', usuariosController.getRolesWithPermissions);
router.get('/:id', usuariosController.getById);
router.post('/', validate(createUsuarioAdminSchema), usuariosController.create);
router.patch('/:id', validate(updateUsuarioSchema), usuariosController.update);
router.delete('/:id', usuariosController.delete);
router.post('/:id/roles', usuariosController.assignRole);
router.delete('/:id/roles', usuariosController.removeRole);

export const usuariosRoutes = router;
