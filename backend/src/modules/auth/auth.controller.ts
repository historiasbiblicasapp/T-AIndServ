import type { Request, Response } from 'express';
import { authService } from './auth.service.js';
import type { AuthRequest } from '../../middleware/auth.js';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body);
    res.json(result);
  }

  async register(req: Request, res: Response): Promise<void> {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1] || '';
    await authService.logout(token);
    res.json({ message: 'Logout realizado' });
  }

  async profile(req: AuthRequest, res: Response): Promise<void> {
    const result = await authService.getProfile(req.user!.id);
    res.json(result);
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const { refresh_token } = req.body;
    const session = await authService.refreshToken(refresh_token);
    res.json({ session });
  }
}

export const authController = new AuthController();
