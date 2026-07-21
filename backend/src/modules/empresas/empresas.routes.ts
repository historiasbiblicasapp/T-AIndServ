import { Router } from 'express';
import { empresasController } from './empresas.controller.js';
import { authMiddleware } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import {
  createEmpresaSchema, updateEmpresaSchema,
  createUnidadeSchema, createSetorSchema, createFuncaoSchema,
} from './empresas.schema.js';

const router = Router();

router.use(authMiddleware);

// Empresas
router.get('/empresas', empresasController.listEmpresas);
router.get('/empresas/:id', empresasController.getEmpresaById);
router.post('/empresas', validate(createEmpresaSchema), empresasController.createEmpresa);
router.patch('/empresas/:id', validate(updateEmpresaSchema), empresasController.updateEmpresa);
router.delete('/empresas/:id', empresasController.deleteEmpresa);

// Unidades
router.get('/unidades', empresasController.listUnidades);
router.post('/unidades', validate(createUnidadeSchema), empresasController.createUnidade);
router.patch('/unidades/:id', empresasController.updateUnidade);
router.delete('/unidades/:id', empresasController.deleteUnidade);

// Setores
router.get('/setores', empresasController.listSetores);
router.post('/setores', validate(createSetorSchema), empresasController.createSetor);
router.patch('/setores/:id', empresasController.updateSetor);
router.delete('/setores/:id', empresasController.deleteSetor);

// Funções
router.get('/funcoes', empresasController.listFuncoes);
router.post('/funcoes', validate(createFuncaoSchema), empresasController.createFuncao);
router.patch('/funcoes/:id', empresasController.updateFuncao);
router.delete('/funcoes/:id', empresasController.deleteFuncao);

export const empresasRoutes = router;
