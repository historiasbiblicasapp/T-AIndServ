import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/errorHandler.js';
import type {
  CreateMaterialInput,
  UpdateMaterialInput,
  AttachMaterialToOsInput,
} from './materiais.schema.js';

export class MateriaisService {
  async list(filters: {
    page?: number;
    limit?: number;
    busca?: string;
    categoria?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('materiais')
      .select('*', { count: 'exact' });

    if (filters.busca) {
      query = query.or(`nome.ilike.%${filters.busca}%,codigo.ilike.%${filters.busca}%`);
    }
    if (filters.categoria) query = query.eq('categoria', filters.categoria);

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

  async getById(id: number) {
    const { data, error } = await supabaseAdmin
      .from('materiais')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new AppError(404, 'Material não encontrado');
    return data;
  }

  async create(data: CreateMaterialInput) {
    const { data: created, error } = await supabaseAdmin
      .from('materiais')
      .insert(data)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new AppError(409, 'Código de material duplicado');
      throw new AppError(400, error.message);
    }

    return created;
  }

  async update(id: number, data: UpdateMaterialInput) {
    const { data: updated, error } = await supabaseAdmin
      .from('materiais')
      .update({ ...data, atualizado_em: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return updated;
  }

  async delete(id: number) {
    const { error } = await supabaseAdmin.from('materiais').delete().eq('id', id);
    if (error) throw new AppError(400, error.message);
    return { message: 'Material excluído' };
  }

  async attachToOs(
    materialId: number,
    osId: number,
    data: AttachMaterialToOsInput,
    usuarioId: string,
  ) {
    const material = await this.getById(materialId);

    const { data: created, error } = await supabaseAdmin
      .from('materiais_os')
      .insert({
        material_id: materialId,
        os_id: osId,
        quantidade: data.quantidade,
        valor_unitario: data.valor_unitario || material.preco_unitario,
        observacao: data.observacao,
        usuario_id: usuarioId,
      })
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return created;
  }

  async listByOs(osId: number) {
    const { data, error } = await supabaseAdmin
      .from('materiais_os')
      .select('*, materiais(*)')
      .eq('os_id', osId)
      .order('criado_em', { ascending: false });

    if (error) throw new AppError(400, error.message);
    return data || [];
  }
}

export const materiaisService = new MateriaisService();
