import type { Request, Response } from 'express';
import { estoqueService } from './estoque.service.js';

function param(req: Request, name: string): number {
  return parseInt(String(req.params[name]));
}

export class EstoqueController {
  async listEstoques(req: Request, res: Response): Promise<void> {
    const result = await estoqueService.listEstoques({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      busca: req.query.busca as string | undefined,
      empresa_id: req.query.empresa_id ? parseInt(req.query.empresa_id as string) : undefined,
    });
    res.json(result);
  }

  async getEstoqueById(req: Request, res: Response): Promise<void> {
    const result = await estoqueService.getEstoqueById(param(req, 'id'));
    res.json(result);
  }

  async createEstoque(req: Request, res: Response): Promise<void> {
    const result = await estoqueService.createEstoque(req.body);
    res.status(201).json(result);
  }

  async updateEstoque(req: Request, res: Response): Promise<void> {
    const result = await estoqueService.updateEstoque(param(req, 'id'), req.body);
    res.json(result);
  }

  async deleteEstoque(req: Request, res: Response): Promise<void> {
    const result = await estoqueService.deleteEstoque(param(req, 'id'));
    res.json(result);
  }

  async listItensEstoque(req: Request, res: Response): Promise<void> {
    const result = await estoqueService.listItensEstoque(
      param(req, 'estoqueId'),
      req.query.busca as string | undefined,
    );
    res.json(result);
  }

  async getItemById(req: Request, res: Response): Promise<void> {
    const result = await estoqueService.getItemById(param(req, 'itemId'));
    res.json(result);
  }

  async createItem(req: Request, res: Response): Promise<void> {
    const result = await estoqueService.createItem({ ...req.body, estoque_id: param(req, 'estoqueId') });
    res.status(201).json(result);
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    const result = await estoqueService.updateItem(param(req, 'itemId'), req.body);
    res.json(result);
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    const result = await estoqueService.deleteItem(param(req, 'itemId'));
    res.json(result);
  }

  async createMovimentacao(req: Request, res: Response): Promise<void> {
    const result = await estoqueService.createMovimentacao({
      ...req.body,
      item_id: param(req, 'itemId'),
      usuario_id: (req as any).user?.id,
    });
    res.status(201).json(result);
  }

  async getMovimentacoes(req: Request, res: Response): Promise<void> {
    const result = await estoqueService.getMovimentacoes(
      param(req, 'itemId'),
      parseInt(req.query.page as string) || 1,
      parseInt(req.query.limit as string) || 20,
    );
    res.json(result);
  }
}

export const estoqueController = new EstoqueController();
