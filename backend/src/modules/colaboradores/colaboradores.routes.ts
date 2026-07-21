import { Router } from 'express';
import { colaboradoresController } from './colaboradores.controller.js';
import { authMiddleware } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { createColaboradorSchema, updateColaboradorSchema } from './colaboradores.schema.js';

const router = Router();

router.use(authMiddleware);

router.get('/', colaboradoresController.list);
router.get('/:id', colaboradoresController.getById);
router.post('/', validate(createColaboradorSchema), colaboradoresController.create);
router.patch('/:id', validate(updateColaboradorSchema), colaboradoresController.update);
router.delete('/:id', colaboradoresController.delete);

// Sub-recursos
router.get('/:id/dependentes', colaboradoresController.getDependentes);
router.post('/:id/dependentes', colaboradoresController.createDependente);
router.delete('/:id/dependentes/:dependenteId', colaboradoresController.deleteDependente);
router.get('/:id/documentos', colaboradoresController.getDocumentos);
router.get('/:id/escolaridade', colaboradoresController.getEscolaridade);
router.get('/:id/ferias', colaboradoresController.getFerias);
router.get('/:id/treinamentos', colaboradoresController.getTreinamentos);
router.get('/:id/movimentacoes', colaboradoresController.getMovimentacoes);
router.get('/:id/exames', colaboradoresController.getExames);

export const colaboradoresRoutes = router;
