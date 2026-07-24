import type { Request, Response } from 'express';
import { treinamentosService } from './treinamentos.service.js';

export class TreinamentosController {
  async listCursos(req: Request, res: Response): Promise<void> {
    const result = await treinamentosService.listCursos();
    res.json(result);
  }

  async listRealizados(req: Request, res: Response): Promise<void> {
    const result = await treinamentosService.listRealizados();
    res.json(result);
  }
}

export const treinamentosController = new TreinamentosController();
