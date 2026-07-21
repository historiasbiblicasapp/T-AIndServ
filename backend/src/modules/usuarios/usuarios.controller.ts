import type { Request, Response } from 'express';
import { usuariosService } from './usuarios.service.js';

function param(req: Request, name: string): string {
  return String(req.params[name]);
}

export class UsuariosController {
  async list(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const busca = req.query.busca as string | undefined;
    const result = await usuariosService.list(page, limit, busca);
    res.json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const result = await usuariosService.getById(param(req, 'id'));
    res.json(result);
  }

  async create(req: Request, res: Response): Promise<void> {
    const result = await usuariosService.create(req.body);
    res.status(201).json(result);
  }

  async update(req: Request, res: Response): Promise<void> {
    const result = await usuariosService.update(param(req, 'id'), req.body);
    res.json(result);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const result = await usuariosService.delete(param(req, 'id'));
    res.json(result);
  }

  async assignRole(req: Request, res: Response): Promise<void> {
    const result = await usuariosService.assignRole(param(req, 'id'), req.body.role_id);
    res.json(result);
  }

  async removeRole(req: Request, res: Response): Promise<void> {
    const result = await usuariosService.removeRole(param(req, 'id'), req.body.role_id);
    res.json(result);
  }

  async listRoles(_req: Request, res: Response): Promise<void> {
    const result = await usuariosService.listRoles();
    res.json(result);
  }

  async getRolesWithPermissions(_req: Request, res: Response): Promise<void> {
    const result = await usuariosService.getRolesWithPermissions();
    res.json(result);
  }
}

export const usuariosController = new UsuariosController();
