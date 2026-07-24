import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/errorHandler.js';
import type {
  CreateEstoqueInput,
  UpdateEstoqueInput,
  CreateItemEstoqueInput,
  UpdateItemEstoqueInput,
  CreateMovimentacaoEstoqueInput,
} from './estoque.schema.js';

export class EstoqueService {
  async listEstoques(filters: {
    page?: number;
    limit?: number;
    busca?: string;
    empresa_id?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('estoque')
      .select('*, usuarios:responsavel_id(nome_completo)', { count: 'exact' });

    if (filters.busca) {
      query = query.or(`nome.ilike.%${filters.busca}%,descricao.ilike.%${filters.busca}%`);
    }
    if (filters.empresa_id) query = query.eq('empresa_id', filters.empresa_id);

    const { data, error, count } = await query
      .order('nome')
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

  async getEstoqueById(id: number) {
    const { data, error } = await supabaseAdmin
      .from('estoque')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new AppError(404, 'Estoque não encontrado');

    const { count } = await supabaseAdmin
      .from('itens_estoque')
      .select('*', { count: 'exact', head: true })
      .eq('estoque_id', id);

    return { ...data, itens_count: count || 0 };
  }

  async createEstoque(data: CreateEstoqueInput) {
    const { data: created, error } = await supabaseAdmin
      .from('estoque')
      .insert(data)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new AppError(409, 'Registro duplicado');
      throw new AppError(400, error.message);
    }

    return created;
  }

  async updateEstoque(id: number, data: UpdateEstoqueInput) {
    const { data: updated, error } = await supabaseAdmin
      .from('estoque')
      .update({ ...data, atualizado_em: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return updated;
  }

  async deleteEstoque(id: number) {
    const { error } = await supabaseAdmin.from('estoque').delete().eq('id', id);
    if (error) throw new AppError(400, error.message);
    return { message: 'Estoque excluído' };
  }

  async listItensEstoque(estoqueId: number, busca?: string) {
    let query = supabaseAdmin
      .from('itens_estoque')
      .select('*')
      .eq('estoque_id', estoqueId);

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%,codigo.ilike.%${busca}%`);
    }

    const { data, error } = await query.order('nome');

    if (error) throw new AppError(400, error.message);
    return data || [];
  }

  async getItemById(id: number) {
    const { data, error } = await supabaseAdmin
      .from('itens_estoque')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new AppError(404, 'Item não encontrado');
    return data;
  }

  async createItem(data: CreateItemEstoqueInput) {
    const { data: created, error } = await supabaseAdmin
      .from('itens_estoque')
      .insert(data)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new AppError(409, 'Código de item duplicado');
      throw new AppError(400, error.message);
    }

    return created;
  }

  async updateItem(id: number, data: UpdateItemEstoqueInput) {
    const { data: updated, error } = await supabaseAdmin
      .from('itens_estoque')
      .update({ ...data, atualizado_em: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return updated;
  }

  async deleteItem(id: number) {
    const { error } = await supabaseAdmin.from('itens_estoque').delete().eq('id', id);
    if (error) throw new AppError(400, error.message);
    return { message: 'Item excluído' };
  }

  async createMovimentacao(data: CreateMovimentacaoEstoqueInput) {
    const { data: item, error: itemError } = await supabaseAdmin
      .from('itens_estoque')
      .select('quantidade_atual')
      .eq('id', data.item_id)
      .single();

    if (itemError || !item) throw new AppError(404, 'Item não encontrado');

    let novaQuantidade = item.quantidade_atual;

    if (data.tipo === 'entrada') {
      novaQuantidade = Number(item.quantidade_atual) + Number(data.quantidade);
    } else if (data.tipo === 'saida') {
      novaQuantidade = Number(item.quantidade_atual) - Number(data.quantidade);
      if (novaQuantidade < 0) throw new AppError(400, 'Quantidade insuficiente em estoque');
    } else if (data.tipo === 'ajuste') {
      novaQuantidade = Number(data.quantidade);
    }

    const { error: updateError } = await supabaseAdmin
      .from('itens_estoque')
      .update({ quantidade_atual: novaQuantidade, atualizado_em: new Date().toISOString() })
      .eq('id', data.item_id);

    if (updateError) throw new AppError(400, updateError.message);

    const usuarioId = (data as any).usuario_id;

    const insertData: any = {
      item_id: data.item_id,
      tipo: data.tipo,
      quantidade: data.quantidade,
      motivo: data.motivo,
      colaborador_id: data.colaborador_id,
      os_id: data.os_id,
    };
    if (usuarioId) insertData.usuario_id = usuarioId;

    const { data: movimentacao, error } = await supabaseAdmin
      .from('movimentacoes_estoque')
      .insert(insertData)
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return movimentacao;
  }

  async getMovimentacoes(itemId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabaseAdmin
      .from('movimentacoes_estoque')
      .select('*, usuarios:usuario_id(nome_completo)', { count: 'exact' })
      .eq('item_id', itemId)
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
}

export const estoqueService = new EstoqueService();
