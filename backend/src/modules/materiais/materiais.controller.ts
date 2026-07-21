import type { Request, Response } from 'express';
import { materiaisService } from './materiais.service.js';

function param(req: Request, name: string): number {
  return parseInt(String(req.params[name]));
}

export class MateriaisController {
  async list(req: Request, res: Response): Promise<void> {
    const result = await materiaisService.list({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      busca: req.query.busca as string | undefined,
      categoria: req.query.categoria as string | undefined,
    });
    res.json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const result = await materiaisService.getById(param(req, 'id'));
    res.json(result);
  }

  async create(req: Request, res: Response): Promise<void> {
    const result = await materiaisService.create(req.body);
    res.status(201).json(result);
  }

  async update(req: Request, res: Response): Promise<void> {
    const result = await materiaisService.update(param(req, 'id'), req.body);
    res.json(result);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const result = await materiaisService.delete(param(req, 'id'));
    res.json(result);
  }

  async attachToOs(req: Request, res: Response): Promise<void> {
    const result = await materiaisService.attachToOs(
      param(req, 'id'),
      param(req, 'osId'),
      req.body,
      (req as any).user?.id,
    );
    res.status(201).json(result);
  }

  async listByOs(req: Request, res: Response): Promise<void> {
    const result = await materiaisService.listByOs(param(req, 'osId'));
    res.json(result);
  }
}

export const materiaisController = new MateriaisController();
