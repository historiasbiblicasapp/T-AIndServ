import { z } from 'zod';

export const createMaterialSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional().nullable(),
  categoria: z.string().min(1).default('geral'),
  unidade: z.string().min(1).default('un'),
  preco_unitario: z.number().default(0),
  estoque_minimo: z.number().int().default(0),
  fornecedor: z.string().optional().nullable(),
  imagem_url: z.string().url().optional().nullable(),
});

export const updateMaterialSchema = createMaterialSchema.partial();

export const attachMaterialToOsSchema = z.object({
  quantidade: z.number().positive('Quantidade deve ser positiva').default(1),
  valor_unitario: z.number().default(0),
  observacao: z.string().optional().nullable(),
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>;
export type AttachMaterialToOsInput = z.infer<typeof attachMaterialToOsSchema>;
