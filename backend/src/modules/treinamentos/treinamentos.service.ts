import { supabaseAdmin } from '../../config/supabase.js';

export class TreinamentosService {
  async listCursos() {
    const { data, error } = await supabaseAdmin
      .from('cursos_treinamentos')
      .select('*')
      .order('nome');

    if (error) throw new Error(error.message);
    return data || [];
  }

  async listRealizados() {
    const { data, error } = await supabaseAdmin
      .from('colaborador_treinamentos')
      .select('*, colaboradores(nome_completo, matricula), cursos_treinamentos(nome, norma_nr)')
      .order('data_realizacao', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }
}

export const treinamentosService = new TreinamentosService();
