import { z } from 'zod';

export const createFeriasSchema = z.object({
  colaborador_id: z.number().int().positive(),
  periodo_aquisitivo: z.string().min(4, 'Período é obrigatório'),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dias_gozados: z.number().int().positive().default(30),
  tipo: z.enum(['integral', 'proporcional', 'abono']).default('integral'),
  fracionamento: z.number().int().positive().default(1),
  observacoes: z.string().optional().nullable(),
});

export const updateFeriasSchema = createFeriasSchema.partial();

export type CreateFeriasInput = z.infer<typeof createFeriasSchema>;
export type UpdateFeriasInput = z.infer<typeof updateFeriasSchema>;
