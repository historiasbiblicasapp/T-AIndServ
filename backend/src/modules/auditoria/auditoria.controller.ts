import type { Request, Response } from 'express';
import { auditoriaService } from './auditoria.service.js';

export class AuditoriaController {
  async list(req: Request, res: Response): Promise<void> {
    const operacao = req.query.operacao as string | undefined;
    const tabela = req.query.tabela as string | undefined;
    const result = await auditoriaService.list(operacao, tabela);
    res.json(result);
  }
}

export const auditoriaController = new AuditoriaController();
