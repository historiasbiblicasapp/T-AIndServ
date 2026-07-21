import { z } from 'zod';

export const updateUsuarioSchema = z.object({
  nome_completo: z.string().min(3).optional(),
  avatar_url: z.string().url().optional().nullable(),
  ativo: z.boolean().optional(),
});

export const createUsuarioAdminSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  nome_completo: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  role: z.enum(['admin', 'rh', 'gestor', 'colaborador', 'auditor']).default('colaborador'),
});

export const assignRoleSchema = z.object({
  role_id: z.number().int().positive(),
});

export const removeRoleSchema = z.object({
  role_id: z.number().int().positive(),
});

export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
export type CreateUsuarioAdminInput = z.infer<typeof createUsuarioAdminSchema>;
