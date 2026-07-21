import { Router } from 'express';
import { estoqueController } from './estoque.controller.js';
import { authMiddleware } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import {
  createEstoqueSchema,
  updateEstoqueSchema,
  createItemEstoqueSchema,
  updateItemEstoqueSchema,
  createMovimentacaoEstoqueSchema,
} from './estoque.schema.js';

const router = Router();

router.use(authMiddleware);

router.get('/', estoqueController.listEstoques);
router.get('/:id', estoqueController.getEstoqueById);
router.post('/', validate(createEstoqueSchema), estoqueController.createEstoque);
router.patch('/:id', validate(updateEstoqueSchema), estoqueController.updateEstoque);
router.delete('/:id', estoqueController.deleteEstoque);

router.get('/:estoqueId/itens', estoqueController.listItensEstoque);
router.post('/:estoqueId/itens', validate(createItemEstoqueSchema), estoqueController.createItem);
router.get('/:estoqueId/itens/:itemId', estoqueController.getItemById);
router.patch('/:estoqueId/itens/:itemId', validate(updateItemEstoqueSchema), estoqueController.updateItem);
router.delete('/:estoqueId/itens/:itemId', estoqueController.deleteItem);

router.get('/:estoqueId/itens/:itemId/movimentacoes', estoqueController.getMovimentacoes);
router.post('/:estoqueId/itens/:itemId/movimentacoes', validate(createMovimentacaoEstoqueSchema), estoqueController.createMovimentacao);

export const estoqueRoutes = router;
