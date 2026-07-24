import { z } from 'zod';

export const listAuditoriaSchema = z.object({
  operacao: z.enum(['INSERT', 'UPDATE', 'DELETE']).optional(),
  tabela: z.string().optional(),
});

export type ListAuditoriaInput = z.infer<typeof listAuditoriaSchema>;
