import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ColaboradorForm } from "@/components/ColaboradorForm";

interface Colaborador {
  id: number;
  matricula: string;
  nome_completo: string;
  cpf: string;
  admissao: string;
  status: string;
  tipo_colaborador: string;
  empresas?: { nome_fantasia: string };
  setores?: { nome: string };
  funcoes?: { nome: string };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const statusColors: Record<string, "default" | "success" | "warning" | "destructive"> = {
  ativo: "success",
  ferias: "warning",
  afastado: "destructive",
  suspenso: "destructive",
  desligado: "destructive",
};

export function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editColaborador, setEditColaborador] = useState<Colaborador | null>(null);

  useEffect(() => {
    loadColaboradores();
  }, [pagination.page, busca]);

  async function loadColaboradores() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });
      if (busca) params.append("busca", busca);

      const { data } = await api.get(`/colaboradores?${params}`);
      setColaboradores(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Erro ao carregar colaboradores", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Colaboradores</h1>
          <p className="text-gray-500">{pagination.total} colaboradores cadastrados</p>
        </div>
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={() => { setEditColaborador(null); setFormOpen(true); }}
        >
          <Plus size={16} className="mr-2" />
          Novo Colaborador
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nome, CPF ou matrícula..."
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Admissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : colaboradores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    Nenhum colaborador encontrado
                  </TableCell>
                </TableRow>
              ) : (
                colaboradores.map((col) => (
                  <TableRow key={col.id}>
                    <TableCell className="font-mono text-sm">{col.matricula}</TableCell>
                    <TableCell className="font-medium">{col.nome_completo}</TableCell>
                    <TableCell className="font-mono text-sm">{col.cpf}</TableCell>
                    <TableCell>{col.empresas?.nome_fantasia || "-"}</TableCell>
                    <TableCell>{col.setores?.nome || "-"}</TableCell>
                    <TableCell>{col.funcoes?.nome || "-"}</TableCell>
                    <TableCell>{formatDate(col.admissao)}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[col.status] || "default"}>
                        {col.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditColaborador(col); setFormOpen(true); }}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Eye size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Página {pagination.page} de {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ColaboradorForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSaved={() => { setFormOpen(false); loadColaboradores(); }}
        colaborador={editColaborador}
      />
    </div>
  );
}
