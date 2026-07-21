import type { Request, Response } from 'express';
import { osService } from './os.service.js';

function param(req: Request, name: string): number {
  return parseInt(String(req.params[name]));
}

export class OsController {
  async list(req: Request, res: Response): Promise<void> {
    const result = await osService.list({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      busca: req.query.busca as string | undefined,
      status: req.query.status as string | undefined,
      tipo: req.query.tipo as string | undefined,
      prioridade: req.query.prioridade as string | undefined,
      empresa_id: req.query.empresa_id ? parseInt(req.query.empresa_id as string) : undefined,
    });
    res.json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const result = await osService.getById(param(req, 'id'));
    res.json(result);
  }

  async create(req: Request, res: Response): Promise<void> {
    const result = await osService.create(req.body, (req as any).user?.id);
    res.status(201).json(result);
  }

  async update(req: Request, res: Response): Promise<void> {
    const result = await osService.update(param(req, 'id'), req.body);
    res.json(result);
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const { status, descricao } = req.body;
    const result = await osService.updateStatus(
      param(req, 'id'),
      status,
      (req as any).user?.id,
      descricao,
    );
    res.json(result);
  }

  async addHistorico(req: Request, res: Response): Promise<void> {
    const result = await osService.addHistorico(param(req, 'id'), {
      ...req.body,
      usuario_id: (req as any).user?.id,
    });
    res.status(201).json(result);
  }

  async getHistorico(req: Request, res: Response): Promise<void> {
    const result = await osService.getHistorico(param(req, 'id'));
    res.json(result);
  }
}

export const osController = new OsController();
