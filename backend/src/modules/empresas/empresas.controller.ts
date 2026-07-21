import type { Request, Response } from 'express';
import { empresasService } from './empresas.service.js';

function param(req: Request, name: string): number {
  return parseInt(String(req.params[name]));
}

export class EmpresasController {
  async listEmpresas(req: Request, res: Response): Promise<void> {
    const busca = req.query.busca as string | undefined;
    const result = await empresasService.listEmpresas(busca);
    res.json(result);
  }

  async getEmpresaById(req: Request, res: Response): Promise<void> {
    const result = await empresasService.getEmpresaById(param(req, 'id'));
    res.json(result);
  }

  async createEmpresa(req: Request, res: Response): Promise<void> {
    const result = await empresasService.createEmpresa(req.body);
    res.status(201).json(result);
  }

  async updateEmpresa(req: Request, res: Response): Promise<void> {
    const result = await empresasService.updateEmpresa(param(req, 'id'), req.body);
    res.json(result);
  }

  async deleteEmpresa(req: Request, res: Response): Promise<void> {
    const result = await empresasService.deleteEmpresa(param(req, 'id'));
    res.json(result);
  }

  async listUnidades(req: Request, res: Response): Promise<void> {
    const empresaId = req.query.empresa_id ? parseInt(req.query.empresa_id as string) : undefined;
    const result = await empresasService.listUnidades(empresaId);
    res.json(result);
  }

  async createUnidade(req: Request, res: Response): Promise<void> {
    const result = await empresasService.createUnidade(req.body);
    res.status(201).json(result);
  }

  async updateUnidade(req: Request, res: Response): Promise<void> {
    const result = await empresasService.updateUnidade(param(req, 'id'), req.body);
    res.json(result);
  }

  async deleteUnidade(req: Request, res: Response): Promise<void> {
    const result = await empresasService.deleteUnidade(param(req, 'id'));
    res.json(result);
  }

  async listSetores(req: Request, res: Response): Promise<void> {
    const unidadeId = req.query.unidade_id ? parseInt(req.query.unidade_id as string) : undefined;
    const result = await empresasService.listSetores(unidadeId);
    res.json(result);
  }

  async createSetor(req: Request, res: Response): Promise<void> {
    const result = await empresasService.createSetor(req.body);
    res.status(201).json(result);
  }

  async updateSetor(req: Request, res: Response): Promise<void> {
    const result = await empresasService.updateSetor(param(req, 'id'), req.body);
    res.json(result);
  }

  async deleteSetor(req: Request, res: Response): Promise<void> {
    const result = await empresasService.deleteSetor(param(req, 'id'));
    res.json(result);
  }

  async listFuncoes(req: Request, res: Response): Promise<void> {
    const setorId = req.query.setor_id ? parseInt(req.query.setor_id as string) : undefined;
    const result = await empresasService.listFuncoes(setorId);
    res.json(result);
  }

  async createFuncao(req: Request, res: Response): Promise<void> {
    const result = await empresasService.createFuncao(req.body);
    res.status(201).json(result);
  }

  async updateFuncao(req: Request, res: Response): Promise<void> {
    const result = await empresasService.updateFuncao(param(req, 'id'), req.body);
    res.json(result);
  }

  async deleteFuncao(req: Request, res: Response): Promise<void> {
    const result = await empresasService.deleteFuncao(param(req, 'id'));
    res.json(result);
  }
}

export const empresasController = new EmpresasController();
