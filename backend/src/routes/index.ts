import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { usuariosRoutes } from '../modules/usuarios/usuarios.routes.js';
import { empresasRoutes } from '../modules/empresas/empresas.routes.js';
import { colaboradoresRoutes } from '../modules/colaboradores/colaboradores.routes.js';
import { estoqueRoutes } from '../modules/estoque/estoque.routes.js';
import { materiaisRoutes } from '../modules/materiais/materiais.routes.js';
import { osRoutes } from '../modules/os/os.routes.js';
import { treinamentosRoutes } from '../modules/treinamentos/treinamentos.routes.js';
import { saudeRoutes } from '../modules/saude/saude.routes.js';
import { feriasRoutes } from '../modules/ferias/ferias.routes.js';
import { auditoriaRoutes } from '../modules/auditoria/auditoria.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/estrutura', empresasRoutes);
router.use('/colaboradores', colaboradoresRoutes);
router.use('/estoque', estoqueRoutes);
router.use('/materiais', materiaisRoutes);
router.use('/os', osRoutes);
router.use('/treinamentos', treinamentosRoutes);
router.use('/saude', saudeRoutes);
router.use('/ferias', feriasRoutes);
router.use('/auditoria', auditoriaRoutes);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export const routes = router;
