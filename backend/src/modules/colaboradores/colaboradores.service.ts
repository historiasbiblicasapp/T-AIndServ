import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/errorHandler.js';
import type { CreateColaboradorInput, UpdateColaboradorInput } from './colaboradores.schema.js';

export class ColaboradoresService {
  async list(filters: {
    page?: number;
    limit?: number;
    busca?: string;
    empresa_id?: number;
    setor_id?: number;
    funcao_id?: number;
    status?: string;
    tipo_colaborador?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('colaboradores')
      .select(`
        *,
        empresas(id, nome_fantasia),
        unidades(id, nome),
        setores(id, nome),
        funcoes(id, nome)
      `, { count: 'exact' });

    if (filters.busca) {
      query = query.or(`nome_completo.ilike.%${filters.busca}%,cpf.ilike.%${filters.busca}%,matricula.ilike.%${filters.busca}%`);
    }
    if (filters.empresa_id) query = query.eq('empresa_id', filters.empresa_id);
    if (filters.setor_id) query = query.eq('setor_id', filters.setor_id);
    if (filters.funcao_id) query = query.eq('funcao_id', filters.funcao_id);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.tipo_colaborador) query = query.eq('tipo_colaborador', filters.tipo_colaborador);

    const { data, error, count } = await query
      .order('nome_completo')
      .range(offset, offset + limit - 1);

    if (error) throw new AppError(400, error.message);

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  }

  async getById(id: number) {
    const { data, error } = await supabaseAdmin
      .from('colaboradores')
      .select(`
        *,
        empresas(id, razao_social, nome_fantasia, cnpj),
        unidades(id, nome, cidade),
        setores(id, nome),
        funcoes(id, nome, salario_base, periculosidade, insalubridade, grau_insalubridade)
      `)
      .eq('id', id)
      .single();

    if (error || !data) throw new AppError(404, 'Colaborador não encontrado');
    return data;
  }

  async create(data: CreateColaboradorInput) {
    const { data: created, error } = await supabaseAdmin
      .from('colaboradores')
      .insert(data)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        if (error.message.includes('cpf')) throw new AppError(409, 'CPF já cadastrado');
        if (error.message.includes('matricula')) throw new AppError(409, 'Matrícula já existe');
        throw new AppError(409, 'Registro duplicado');
      }
      throw new AppError(400, error.message);
    }

    return created;
  }

  async update(id: number, data: UpdateColaboradorInput) {
    const { data: updated, error } = await supabaseAdmin
      .from('colaboradores')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return updated;
  }

  async delete(id: number) {
    const { error } = await supabaseAdmin.from('colaboradores').delete().eq('id', id);
    if (error) throw new AppError(400, error.message);
    return { message: 'Colaborador excluído' };
  }

  async getDependentes(colaboradorId: number) {
    const { data, error } = await supabaseAdmin
      .from('dependentes')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .order('nome_completo');

    if (error) throw new AppError(400, error.message);
    return data;
  }

  async createDependente(colaboradorId: number, data: any) {
    const { data: created, error } = await supabaseAdmin
      .from('dependentes')
      .insert({ ...data, colaborador_id: colaboradorId })
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return created;
  }

  async deleteDependente(id: number) {
    const { error } = await supabaseAdmin.from('dependentes').delete().eq('id', id);
    if (error) throw new AppError(400, error.message);
    return { message: 'Dependente excluído' };
  }

  async getDocumentos(colaboradorId: number) {
    const { data, error } = await supabaseAdmin
      .from('documentos')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .order('criado_em', { ascending: false });

    if (error) throw new AppError(400, error.message);
    return data;
  }

  async getEscolaridade(colaboradorId: number) {
    const { data, error } = await supabaseAdmin
      .from('escolaridade')
      .select('*')
      .eq('colaborador_id', colaboradorId);

    if (error) throw new AppError(400, error.message);
    return data;
  }

  async getFerias(colaboradorId: number) {
    const { data, error } = await supabaseAdmin
      .from('ferias')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .order('data_inicio', { ascending: false });

    if (error) throw new AppError(400, error.message);
    return data;
  }

  async getTreinamentos(colaboradorId: number) {
    const { data, error } = await supabaseAdmin
      .from('colaborador_treinamentos')
      .select('*, cursos_treinamentos(*)')
      .eq('colaborador_id', colaboradorId)
      .order('data_realizacao', { ascending: false });

    if (error) throw new AppError(400, error.message);
    return data;
  }

  async getMovimentacoes(colaboradorId: number) {
    const { data, error } = await supabaseAdmin
      .from('movimentacoes')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .order('data_movimentacao', { ascending: false });

    if (error) throw new AppError(400, error.message);
    return data;
  }

  async getExames(colaboradorId: number) {
    const aso = await supabaseAdmin
      .from('exames_aso')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .order('data_exame', { ascending: false });

    const periodicos = await supabaseAdmin
      .from('exames_periodicos')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .order('data_realizacao', { ascending: false });

    return {
      aso: aso.data || [],
      periodicos: periodicos.data || [],
    };
  }
}

export const colaboradoresService = new ColaboradoresService();
