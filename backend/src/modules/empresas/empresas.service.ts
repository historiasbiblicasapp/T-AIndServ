import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/errorHandler.js';
import type {
  CreateEmpresaInput, UpdateEmpresaInput,
  CreateUnidadeInput, CreateSetorInput, CreateFuncaoInput,
} from './empresas.schema.js';

export class EmpresasService {
  // ---- EMPRESAS ----

  async listEmpresas(busca?: string) {
    let query = supabaseAdmin
      .from('empresas')
      .select('*', { count: 'exact' });

    if (busca) {
      query = query.or(`razao_social.ilike.%${busca}%,nome_fantasia.ilike.%${busca}%,cnpj.ilike.%${busca}%`);
    }

    const { data, error, count } = await query.order('razao_social');
    if (error) throw new AppError(400, error.message);
    return { data: data || [], total: count };
  }

  async getEmpresaById(id: number) {
    const { data, error } = await supabaseAdmin
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new AppError(404, 'Empresa não encontrada');
    return data;
  }

  async createEmpresa(data: CreateEmpresaInput) {
    const { data: created, error } = await supabaseAdmin
      .from('empresas')
      .insert(data)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new AppError(409, 'CNPJ já cadastrado');
      throw new AppError(400, error.message);
    }
    return created;
  }

  async updateEmpresa(id: number, data: UpdateEmpresaInput) {
    const { data: updated, error } = await supabaseAdmin
      .from('empresas')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return updated;
  }

  async deleteEmpresa(id: number) {
    const { error } = await supabaseAdmin.from('empresas').delete().eq('id', id);
    if (error) throw new AppError(400, error.message);
    return { message: 'Empresa excluída' };
  }

  // ---- UNIDADES ----

  async listUnidades(empresaId?: number) {
    let query = supabaseAdmin.from('unidades').select('*, empresas(nome_fantasia)');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query.order('nome');
    if (error) throw new AppError(400, error.message);
    return data;
  }

  async createUnidade(data: CreateUnidadeInput) {
    const { data: created, error } = await supabaseAdmin
      .from('unidades')
      .insert(data)
      .select()
      .single();
    if (error) throw new AppError(400, error.message);
    return created;
  }

  async updateUnidade(id: number, data: Partial<CreateUnidadeInput>) {
    const { data: updated, error } = await supabaseAdmin
      .from('unidades')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new AppError(400, error.message);
    return updated;
  }

  async deleteUnidade(id: number) {
    const { error } = await supabaseAdmin.from('unidades').delete().eq('id', id);
    if (error) throw new AppError(400, error.message);
    return { message: 'Unidade excluída' };
  }

  // ---- SETORES ----

  async listSetores(unidadeId?: number) {
    let query = supabaseAdmin.from('setores').select('*, unidades(nome, empresa_id)');
    if (unidadeId) query = query.eq('unidade_id', unidadeId);
    const { data, error } = await query.order('nome');
    if (error) throw new AppError(400, error.message);
    return data;
  }

  async createSetor(data: CreateSetorInput) {
    const { data: created, error } = await supabaseAdmin
      .from('setores')
      .insert(data)
      .select()
      .single();
    if (error) throw new AppError(400, error.message);
    return created;
  }

  async updateSetor(id: number, data: Partial<CreateSetorInput>) {
    const { data: updated, error } = await supabaseAdmin
      .from('setores')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new AppError(400, error.message);
    return updated;
  }

  async deleteSetor(id: number) {
    const { error } = await supabaseAdmin.from('setores').delete().eq('id', id);
    if (error) throw new AppError(400, error.message);
    return { message: 'Setor excluído' };
  }

  // ---- FUNÇÕES ----

  async listFuncoes(setorId?: number) {
    let query = supabaseAdmin.from('funcoes').select('*, setores(nome, unidade_id)');
    if (setorId) query = query.eq('setor_id', setorId);
    const { data, error } = await query.order('nome');
    if (error) throw new AppError(400, error.message);
    return data;
  }

  async createFuncao(data: CreateFuncaoInput) {
    const { data: created, error } = await supabaseAdmin
      .from('funcoes')
      .insert(data)
      .select()
      .single();
    if (error) throw new AppError(400, error.message);
    return created;
  }

  async updateFuncao(id: number, data: Partial<CreateFuncaoInput>) {
    const { data: updated, error } = await supabaseAdmin
      .from('funcoes')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new AppError(400, error.message);
    return updated;
  }

  async deleteFuncao(id: number) {
    const { error } = await supabaseAdmin.from('funcoes').delete().eq('id', id);
    if (error) throw new AppError(400, error.message);
    return { message: 'Função excluída' };
  }
}

export const empresasService = new EmpresasService();
