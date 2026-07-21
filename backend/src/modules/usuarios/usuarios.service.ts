import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/errorHandler.js';
import type { UpdateUsuarioInput, CreateUsuarioAdminInput } from './usuarios.schema.js';

export class UsuariosService {
  async list(page = 1, limit = 20, busca?: string) {
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('usuarios')
      .select('*', { count: 'exact' });

    if (busca) {
      query = query.or(`nome_completo.ilike.%${busca}%,email.ilike.%${busca}%`);
    }

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

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    const { data: roles } = await supabaseAdmin
      .from('usuario_roles')
      .select('roles(id, nome, nivel, descricao)')
      .eq('usuario_id', id);

    return {
      ...data,
      roles: roles?.map((r: any) => r.roles) || [],
    };
  }

  async update(id: string, data: UpdateUsuarioInput) {
    const { data: updated, error } = await supabaseAdmin
      .from('usuarios')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return updated;
  }

  async create(data: CreateUsuarioAdminInput) {
    // Criar no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        nome_completo: data.nome_completo,
      },
    });

    if (authError) {
      if (authError.message.includes('already')) {
        throw new AppError(409, 'Email já cadastrado');
      }
      throw new AppError(400, authError.message);
    }

    // Atribuir role
    const { data: role } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('nome', data.role)
      .single();

    if (role) {
      await supabaseAdmin.from('usuario_roles').insert({
        usuario_id: authData.user.id,
        role_id: role.id,
      });
    }

    return {
      id: authData.user.id,
      email: data.email,
      nome_completo: data.nome_completo,
      role: data.role,
    };
  }

  async delete(id: string) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw new AppError(400, error.message);
    return { message: 'Usuário excluído' };
  }

  async assignRole(usuarioId: string, roleId: number) {
    const { error } = await supabaseAdmin
      .from('usuario_roles')
      .insert({ usuario_id: usuarioId, role_id: roleId });

    if (error) {
      if (error.code === '23505') {
        throw new AppError(409, 'Usuário já possui esta role');
      }
      throw new AppError(400, error.message);
    }

    return { message: 'Role atribuída' };
  }

  async removeRole(usuarioId: string, roleId: number) {
    const { error } = await supabaseAdmin
      .from('usuario_roles')
      .delete()
      .eq('usuario_id', usuarioId)
      .eq('role_id', roleId);

    if (error) throw new AppError(400, error.message);
    return { message: 'Role removida' };
  }

  async listRoles() {
    const { data, error } = await supabaseAdmin
      .from('roles')
      .select('*')
      .order('nivel', { ascending: false });

    if (error) throw new AppError(400, error.message);
    return data;
  }

  async getRolesWithPermissions() {
    const { data, error } = await supabaseAdmin
      .from('roles')
      .select('*, role_permissions(permissoes(*))')
      .order('nivel', { ascending: false });

    if (error) throw new AppError(400, error.message);

    return data?.map((role: any) => ({
      ...role,
      permissoes: role.role_permissions?.map((rp: any) => rp.permissoes) || [],
    }));
  }
}

export const usuariosService = new UsuariosService();
