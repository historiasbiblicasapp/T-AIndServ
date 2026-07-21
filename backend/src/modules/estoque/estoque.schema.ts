import { z } from 'zod';

export const createEstoqueSchema = z.object({
  empresa_id: z.number().int().positive(),
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional().nullable(),
  localizacao: z.string().optional().nullable(),
});

export const updateEstoqueSchema = createEstoqueSchema.omit({ empresa_id: true }).partial();

export const createItemEstoqueSchema = z.object({
  estoque_id: z.number().int().positive(),
  codigo: z.string().min(1, 'Código é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional().nullable(),
  categoria: z.string().optional().nullable(),
  unidade: z.string().min(1, 'Unidade é obrigatória').default('un'),
  quantidade_atual: z.number().default(0),
  quantidade_minima: z.number().default(0),
  quantidade_maxima: z.number().default(0),
  preco_unitario: z.number().default(0),
  fornecedor: z.string().optional().nullable(),
  validade: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  numero_lote: z.string().optional().nullable(),
});

export const updateItemEstoqueSchema = createItemEstoqueSchema.omit({ estoque_id: true }).partial();

export const createMovimentacaoEstoqueSchema = z.object({
  item_id: z.number().int().positive(),
  tipo: z.enum(['entrada', 'saida', 'transferencia', 'ajuste']),
  quantidade: z.number().positive('Quantidade deve ser positiva'),
  motivo: z.string().optional().nullable(),
  colaborador_id: z.string().uuid().optional().nullable(),
  os_id: z.number().int().positive().optional().nullable(),
});

export type CreateEstoqueInput = z.infer<typeof createEstoqueSchema>;
export type UpdateEstoqueInput = z.infer<typeof updateEstoqueSchema>;
export type CreateItemEstoqueInput = z.infer<typeof createItemEstoqueSchema>;
export type UpdateItemEstoqueInput = z.infer<typeof updateItemEstoqueSchema>;
export type CreateMovimentacaoEstoqueInput = z.infer<typeof createMovimentacaoEstoqueSchema>;
