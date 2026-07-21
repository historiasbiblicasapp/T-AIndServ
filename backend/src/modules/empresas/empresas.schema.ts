import { z } from 'zod';

const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;

export const createEmpresaSchema = z.object({
  razao_social: z.string().min(3, 'Razão social é obrigatória'),
  nome_fantasia: z.string().min(3, 'Nome fantasia é obrigatório'),
  cnpj: z.string().regex(cnpjRegex, 'CNPJ inválido (XX.XXX.XXX/XXXX-XX)'),
  inscricao_estadual: z.string().optional().nullable(),
  inscricao_municipal: z.string().optional().nullable(),
  endereco: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  estado: z.string().length(2, 'UF deve ter 2 caracteres').optional().nullable(),
  cep: z.string().optional().nullable(),
  telefone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
});

export const updateEmpresaSchema = createEmpresaSchema.partial();

export const createUnidadeSchema = z.object({
  empresa_id: z.number().int().positive(),
  nome: z.string().min(3, 'Nome é obrigatório'),
  codigo: z.string().optional().nullable(),
  endereco: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  estado: z.string().length(2).optional().nullable(),
  cep: z.string().optional().nullable(),
});

export const updateUnidadeSchema = createUnidadeSchema.omit({ empresa_id: true }).partial();

export const createSetorSchema = z.object({
  unidade_id: z.number().int().positive(),
  nome: z.string().min(3, 'Nome é obrigatório'),
  codigo: z.string().optional().nullable(),
  responsavel_id: z.string().uuid().optional().nullable(),
});

export const updateSetorSchema = createSetorSchema.omit({ unidade_id: true }).partial();

export const createFuncaoSchema = z.object({
  setor_id: z.number().int().positive(),
  nome: z.string().min(3, 'Nome é obrigatório'),
  descricao: z.string().optional().nullable(),
  salario_base: z.number().positive().optional().nullable(),
  periculosidade: z.boolean().default(false),
  insalubridade: z.boolean().default(false),
  grau_insalubridade: z.enum(['nenhum', 'minimo', 'medio', 'maximo']).default('nenhum'),
});

export const updateFuncaoSchema = createFuncaoSchema.omit({ setor_id: true }).partial();

export type CreateEmpresaInput = z.infer<typeof createEmpresaSchema>;
export type UpdateEmpresaInput = z.infer<typeof updateEmpresaSchema>;
export type CreateUnidadeInput = z.infer<typeof createUnidadeSchema>;
export type CreateSetorInput = z.infer<typeof createSetorSchema>;
export type CreateFuncaoInput = z.infer<typeof createFuncaoSchema>;
