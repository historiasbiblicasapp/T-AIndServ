import { z } from 'zod';

export const createTreinamentoSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  descricao: z.string().optional().nullable(),
  carga_horaria: z.number().int().positive().optional().nullable(),
  tipo: z.enum(['interno', 'externo', 'online', 'obrigatorio', 'nr']).default('interno'),
  norma_nr: z.string().optional().nullable(),
  validade_meses: z.number().int().positive().optional().nullable(),
  obrigatorio: z.boolean().default(false),
});

export const createColaboradorTreinamentoSchema = z.object({
  colaborador_id: z.number().int().positive(),
  curso_treinamento_id: z.number().int().positive(),
  data_realizacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_validade: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  carga_horaria: z.number().int().positive().optional().nullable(),
  nota: z.number().min(0).max(10).optional().nullable(),
  aprovado: z.boolean().optional().nullable(),
  certificado_url: z.string().url().optional().nullable(),
  observacoes: z.string().optional().nullable(),
});

export type CreateTreinamentoInput = z.infer<typeof createTreinamentoSchema>;
export type CreateColaboradorTreinamentoInput = z.infer<typeof createColaboradorTreinamentoSchema>;
