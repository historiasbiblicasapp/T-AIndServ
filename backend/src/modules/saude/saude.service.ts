import { supabaseAdmin } from '../../config/supabase.js';

export class SaudeService {
  async listASOs() {
    const { data, error } = await supabaseAdmin
      .from('exames_aso')
      .select('*, colaboradores(nome_completo, matricula)')
      .order('data_exame', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async listExames() {
    const { data, error } = await supabaseAdmin
      .from('exames_periodicos')
      .select('*, colaboradores(nome_completo, matricula)')
      .order('data_realizacao', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async listCATs() {
    const { data, error } = await supabaseAdmin
      .from('cat')
      .select('*, colaboradores(nome_completo, matricula)')
      .order('data_acidente', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }
}

export const saudeService = new SaudeService();
