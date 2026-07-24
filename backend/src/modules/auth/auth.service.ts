import { supabase, supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/errorHandler.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

export class AuthService {
  async login(data: LoginInput) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new AppError(401, 'Email ou senha inválidos');
    }

    const { data: usuario } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (!usuario?.ativo) {
      await supabase.auth.signOut();
      throw new AppError(403, 'Conta desativada');
    }

    const { data: roles } = await supabaseAdmin
      .from('usuario_roles')
      .select('roles(id, nome, nivel)')
      .eq('usuario_id', authData.user.id);

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        nome_completo: usuario.nome_completo,
        avatar_url: usuario.avatar_url,
        roles: roles?.map((r: any) => r.roles) || [],
      },
      session: authData.session,
    };
  }

  async register(data: RegisterInput) {
    const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        nome_completo: data.nome_completo,
      },
    });

    if (error) {
      if (error.message.includes('already')) {
        throw new AppError(409, 'Email já cadastrado');
      }
      throw new AppError(400, error.message);
    }

    // Verificar se o trigger já criou o registro na tabela usuarios
    const { data: existing } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('id', authData.user.id)
      .single();

    if (!existing) {
      // Trigger não executou, criar manualmente
      await supabaseAdmin.from('usuarios').insert({
        id: authData.user.id,
        email: data.email,
        nome_completo: data.nome_completo,
        ativo: true,
      });
    }

    // Verificar se já tem role (trigger pode ter atribuído)
    const { data: existingRole } = await supabaseAdmin
      .from('usuario_roles')
      .select('role_id')
      .eq('usuario_id', authData.user.id)
      .limit(1)
      .maybeSingle();

    if (!existingRole) {
      const { data: roleColaborador } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('nome', 'colaborador')
        .single();

      if (roleColaborador) {
        await supabaseAdmin.from('usuario_roles').insert({
          usuario_id: authData.user.id,
          role_id: roleColaborador.id,
        });
      }
    }

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        nome_completo: data.nome_completo,
      },
      message: 'Conta criada com sucesso.',
    };
  }

  async logout(token: string) {
    const { error } = await supabaseAdmin.auth.admin.signOut(token);
    if (error) {
      throw new AppError(400, 'Erro ao fazer logout');
    }
  }

  async getProfile(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    const { data: roles } = await supabaseAdmin
      .from('usuario_roles')
      .select('roles(id, nome, nivel, descricao)')
      .eq('usuario_id', userId);

    const { data: permissoes } = await supabaseAdmin
      .from('usuario_roles')
      .select('role_permissions(permissoes(chave, modulo))')
      .eq('usuario_id', userId);

    return {
      ...data,
      roles: roles?.map((r: any) => r.roles) || [],
      permissoes: permissoes?.flatMap((r: any) =>
        r.role_permissions?.map((rp: any) => rp.permissoes) || []
      ) || [],
    };
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new AppError(401, 'Token de refresh inválido');
    }

    return data.session;
  }
}

export const authService = new AuthService();
