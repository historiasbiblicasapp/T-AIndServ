import { supabaseAdmin } from '../../config/supabase.js';

export class FeriasService {
  async list(status?: string) {
    let query = supabaseAdmin
      .from('ferias')
      .select('*, colaboradores(nome_completo, matricula)');

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('data_inicio', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }
}

export const feriasService = new FeriasService();
