import { z } from 'zod';

export const createOSSchema = z.object({
  numero: z.string().min(1, 'Número é obrigatório'),
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional().nullable(),
  tipo: z.enum(['manutencao', 'corretiva', 'preventiva', 'emergencial']).default('manutencao'),
  prioridade: z.enum(['baixa', 'media', 'alta', 'urgente']).default('media'),
  empresa_id: z.number().int().positive(),
  colaborador_id: z.string().uuid().optional().nullable(),
  solicitante: z.string().optional().nullable(),
  setor_solicitante: z.string().optional().nullable(),
  data_prevista: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  observacoes: z.string().optional().nullable(),
});

export const updateOSSchema = createOSSchema.omit({ empresa_id: true, numero: true }).partial().extend({
  titulo: z.string().min(1, 'Título é obrigatório'),
});

export const updateStatusOSSchema = z.object({
  status: z.enum(['aberta', 'em_andamento', 'parada', 'concluida', 'cancelada']),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
});

export const createHistoricoOSSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  os_id: z.number().int().positive(),
});

export type CreateOSInput = z.infer<typeof createOSSchema>;
export type UpdateOSInput = z.infer<typeof updateOSSchema>;
export type UpdateStatusOSInput = z.infer<typeof updateStatusOSSchema>;
export type CreateHistoricoOSInput = z.infer<typeof createHistoricoOSSchema>;
