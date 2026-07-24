import { z } from 'zod';

export const createASOSchema = z.object({
  colaborador_id: z.number().int().positive(),
  tipo_aso: z.enum(['admissional', 'periodico', 'retorno', 'mudanca_funcao', 'demissional']),
  data_exame: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_validade: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  medico_resp: z.string().optional().nullable(),
  resultado: z.enum(['apto', 'inapto', 'apto_com_restricao']),
  restricoes: z.string().optional().nullable(),
  arquivo_url: z.string().url().optional().nullable(),
  observacoes: z.string().optional().nullable(),
});

export const createExamePeriodicoSchema = z.object({
  colaborador_id: z.number().int().positive(),
  tipo_exame: z.string().min(1, 'Tipo é obrigatório'),
  data_realizacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_validade: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  resultado: z.string().optional().nullable(),
  medico_resp: z.string().optional().nullable(),
  crm: z.string().optional().nullable(),
  arquivo_url: z.string().url().optional().nullable(),
});

export const createCATSchema = z.object({
  colaborador_id: z.number().int().positive(),
  data_acidente: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora_acidente: z.string().optional().nullable(),
  tipo_acidente: z.enum(['trabalho', 'trajeto', 'doenca_ocupacional']),
  natureza_lesao: z.string().optional().nullable(),
  parte_corpo: z.string().optional().nullable(),
  agente_causador: z.string().optional().nullable(),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  cid: z.string().optional().nullable(),
  data_afastamento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  retorno: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  mortal: z.boolean().default(false),
  cat_numero: z.string().optional().nullable(),
  arquivo_url: z.string().url().optional().nullable(),
});

export type CreateASOInput = z.infer<typeof createASOSchema>;
export type CreateExamePeriodicoInput = z.infer<typeof createExamePeriodicoSchema>;
export type CreateCATInput = z.infer<typeof createCATSchema>;
