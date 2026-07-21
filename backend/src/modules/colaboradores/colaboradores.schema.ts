import { z } from 'zod';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

export const createColaboradorSchema = z.object({
  empresa_id: z.number().int().positive(),
  unidade_id: z.number().int().positive().optional().nullable(),
  setor_id: z.number().int().positive().optional().nullable(),
  funcao_id: z.number().int().positive().optional().nullable(),
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  nome_completo: z.string().min(3, 'Nome é obrigatório'),
  nome_social: z.string().optional().nullable(),
  cpf: z.string().regex(cpfRegex, 'CPF inválido (XXX.XXX.XXX-XX)'),
  rg: z.string().optional().nullable(),
  orgao_emissor: z.string().optional().nullable(),
  data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sexo: z.enum(['M', 'F', 'Outro']),
  estado_civil: z.enum(['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel']).optional().nullable(),
  raca_cor: z.enum(['branca', 'preta', 'parda', 'amarela', 'indigena', 'nao_declarar']).optional().nullable(),
  nacionalidade: z.string().default('Brasileira'),
  naturalidade: z.string().optional().nullable(),
  email_pessoal: z.string().email().optional().nullable(),
  email_corporativo: z.string().email().optional().nullable(),
  telefone: z.string().optional().nullable(),
  celular: z.string().optional().nullable(),
  endereco: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  estado: z.string().length(2).optional().nullable(),
  cep: z.string().optional().nullable(),
  tipo_sanguineo: z.string().optional().nullable(),
  fator_rh: z.string().optional().nullable(),
  pcd: z.boolean().default(false),
  deficiencia: z.string().optional().nullable(),
  pis_pasep: z.string().optional().nullable(),
  ctps: z.string().optional().nullable(),
  ctps_serie: z.string().optional().nullable(),
  titulo_eleitor: z.string().optional().nullable(),
  certificado_reservista: z.string().optional().nullable(),
  cnh: z.string().optional().nullable(),
  cnh_categoria: z.string().optional().nullable(),
  cnh_validade: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  banco_codigo: z.string().optional().nullable(),
  banco_nome: z.string().optional().nullable(),
  agencia: z.string().optional().nullable(),
  conta: z.string().optional().nullable(),
  pix_chave: z.string().optional().nullable(),
  admissao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tipo_colaborador: z.enum(['efetivo', 'temporario', 'estagio', 'terceirizado', 'clt', 'pj']).default('efetivo'),
});

export const updateColaboradorSchema = createColaboradorSchema.omit({
  empresa_id: true,
  matricula: true,
  cpf: true,
}).partial();

export const listColaboradoresSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  busca: z.string().optional(),
  empresa_id: z.coerce.number().int().positive().optional(),
  setor_id: z.coerce.number().int().positive().optional(),
  funcao_id: z.coerce.number().int().positive().optional(),
  status: z.enum(['ativo', 'ferias', 'afastado', 'suspenso', 'desligado']).optional(),
  tipo_colaborador: z.enum(['efetivo', 'temporario', 'estagio', 'terceirizado', 'clt', 'pj']).optional(),
});

export type CreateColaboradorInput = z.infer<typeof createColaboradorSchema>;
export type UpdateColaboradorInput = z.infer<typeof updateColaboradorSchema>;
