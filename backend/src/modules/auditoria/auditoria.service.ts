import { supabaseAdmin } from '../../config/supabase.js';

export class AuditoriaService {
  async list(operacao?: string, tabela?: string) {
    let query = supabaseAdmin
      .from('auditoria')
      .select('*, usuarios:usuario_id(nome_completo, email)');

    if (operacao) {
      query = query.eq('tipo_operacao', operacao);
    }
    if (tabela) {
      query = query.eq('tabela', tabela);
    }

    const { data, error } = await query.order('criado_em', { ascending: false }).limit(200);

    if (error) throw new Error(error.message);
    return data || [];
  }
}

export const auditoriaService = new AuditoriaService();
