import type { Request, Response } from 'express';
import { feriasService } from './ferias.service.js';

export class FeriasController {
  async list(req: Request, res: Response): Promise<void> {
    const status = req.query.status as string | undefined;
    const result = await feriasService.list(status);
    res.json(result);
  }
}

export const feriasController = new FeriasController();
