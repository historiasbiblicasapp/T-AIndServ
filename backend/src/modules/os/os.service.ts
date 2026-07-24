import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/errorHandler.js';
import type {
  CreateOSInput,
  UpdateOSInput,
  CreateHistoricoOSInput,
} from './os.schema.js';

export class OsService {
  async list(filters: {
    page?: number;
    limit?: number;
    busca?: string;
    status?: string;
    tipo?: string;
    prioridade?: string;
    empresa_id?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('ordens_servico')
      .select(`
        *,
        empresas(id, nome_fantasia),
        usuarios:colaborador_id(nome_completo),
        usuarios_criacao:usuario_criacao(nome_completo)
      `, { count: 'exact' });

    if (filters.busca) {
      query = query.or(`titulo.ilike.%${filters.busca}%,numero.ilike.%${filters.busca}%,solicitante.ilike.%${filters.busca}%`);
    }
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.tipo) query = query.eq('tipo', filters.tipo);
    if (filters.prioridade) query = query.eq('prioridade', filters.prioridade);
    if (filters.empresa_id) query = query.eq('empresa_id', filters.empresa_id);

    const { data, error, count } = await query
      .order('criado_em', { ascending: false })
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
      .from('ordens_servico')
      .select(`
        *,
        empresas(id, nome_fantasia),
        usuarios:colaborador_id(nome_completo),
        usuarios_criacao:usuario_criacao(nome_completo)
      `)
      .eq('id', id)
      .single();

    if (error || !data) throw new AppError(404, 'Ordem de serviço não encontrada');

    const { data: materiais } = await supabaseAdmin
      .from('materiais_os')
      .select('*, materiais(*)')
      .eq('os_id', id);

    const { data: historico } = await supabaseAdmin
      .from('historico_os')
      .select('*, usuarios:usuario_id(nome_completo)')
      .eq('os_id', id)
      .order('criado_em', { ascending: false });

    return {
      ...data,
      materiais: materiais || [],
      historico: historico || [],
    };
  }

  async generateNumero(): Promise<string> {
    const ano = new Date().getFullYear();

    const { data, error } = await supabaseAdmin
      .from('ordens_servico')
      .select('numero')
      .like('numero', `OS-${ano}-%`)
      .order('numero', { ascending: false })
      .limit(1);

    if (error) throw new AppError(400, error.message);

    let proximo = 1;
    if (data && data.length > 0) {
      const ultimo = data[0].numero;
      const partes = ultimo.split('-');
      proximo = parseInt(partes[2]) + 1;
    }

    return `OS-${ano}-${String(proximo).padStart(5, '0')}`;
  }

  async create(data: CreateOSInput, usuarioId: string) {
    const numero = data.numero || (await this.generateNumero());

    const { data: created, error } = await supabaseAdmin
      .from('ordens_servico')
      .insert({
        ...data,
        numero,
        usuario_criacao: usuarioId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new AppError(409, 'Número de OS já existe');
      throw new AppError(400, error.message);
    }

    return created;
  }

  async update(id: number, data: UpdateOSInput) {
    const { data: updated, error } = await supabaseAdmin
      .from('ordens_servico')
      .update({ ...data, atualizado_em: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return updated;
  }

  async updateStatus(id: number, newStatus: string, usuarioId: string, descricao: string) {
    const updateData: any = {
      status: newStatus,
      atualizado_em: new Date().toISOString(),
    };

    if (newStatus === 'concluida') {
      updateData.data_conclusao = new Date().toISOString();
    }

    const { data: updated, error } = await supabaseAdmin
      .from('ordens_servico')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(400, error.message);

    await this.addHistorico(id, { descricao, usuario_id: usuarioId });

    return updated;
  }

  async addHistorico(osId: number, data: { descricao: string; usuario_id: string }) {
    const { data: created, error } = await supabaseAdmin
      .from('historico_os')
      .insert({
        os_id: osId,
        descricao: data.descricao,
        usuario_id: data.usuario_id,
      })
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return created;
  }

  async getHistorico(osId: number) {
    const { data, error } = await supabaseAdmin
      .from('historico_os')
      .select('*, usuarios:usuario_id(nome_completo)')
      .eq('os_id', osId)
      .order('criado_em', { ascending: false });

    if (error) throw new AppError(400, error.message);
    return data || [];
  }
}

export const osService = new OsService();
