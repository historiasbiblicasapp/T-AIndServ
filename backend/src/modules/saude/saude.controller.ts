import type { Request, Response } from 'express';
import { saudeService } from './saude.service.js';

export class SaudeController {
  async listASOs(_req: Request, res: Response): Promise<void> {
    const result = await saudeService.listASOs();
    res.json(result);
  }

  async listExames(_req: Request, res: Response): Promise<void> {
    const result = await saudeService.listExames();
    res.json(result);
  }

  async listCATs(_req: Request, res: Response): Promise<void> {
    const result = await saudeService.listCATs();
    res.json(result);
  }
}

export const saudeController = new SaudeController();
