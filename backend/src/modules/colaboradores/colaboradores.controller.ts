import type { Request, Response } from 'express';
import { colaboradoresService } from './colaboradores.service.js';

function param(req: Request, name: string): number {
  return parseInt(String(req.params[name]));
}

export class ColaboradoresController {
  async list(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.list({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      busca: req.query.busca as string | undefined,
      empresa_id: req.query.empresa_id ? parseInt(req.query.empresa_id as string) : undefined,
      setor_id: req.query.setor_id ? parseInt(req.query.setor_id as string) : undefined,
      funcao_id: req.query.funcao_id ? parseInt(req.query.funcao_id as string) : undefined,
      status: req.query.status as string | undefined,
      tipo_colaborador: req.query.tipo_colaborador as string | undefined,
    });
    res.json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.getById(param(req, 'id'));
    res.json(result);
  }

  async create(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.create(req.body);
    res.status(201).json(result);
  }

  async update(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.update(param(req, 'id'), req.body);
    res.json(result);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.delete(param(req, 'id'));
    res.json(result);
  }

  async getDependentes(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.getDependentes(param(req, 'id'));
    res.json(result);
  }

  async createDependente(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.createDependente(param(req, 'id'), req.body);
    res.status(201).json(result);
  }

  async deleteDependente(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.deleteDependente(param(req, 'dependenteId'));
    res.json(result);
  }

  async getDocumentos(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.getDocumentos(param(req, 'id'));
    res.json(result);
  }

  async getEscolaridade(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.getEscolaridade(param(req, 'id'));
    res.json(result);
  }

  async getFerias(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.getFerias(param(req, 'id'));
    res.json(result);
  }

  async getTreinamentos(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.getTreinamentos(param(req, 'id'));
    res.json(result);
  }

  async getMovimentacoes(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.getMovimentacoes(param(req, 'id'));
    res.json(result);
  }

  async getExames(req: Request, res: Response): Promise<void> {
    const result = await colaboradoresService.getExames(param(req, 'id'));
    res.json(result);
  }
}

export const colaboradoresController = new ColaboradoresController();
