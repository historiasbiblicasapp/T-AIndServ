import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Check, X, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Ferias {
  id: number;
  colaborador_id: number;
  periodo_aquisitivo: string;
  data_inicio: string;
  data_fim: string;
  dias_gozados: number;
  tipo: string;
  status: string;
  colaboradores?: { nome_completo: string; matricula: string };
}

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "destructive"; icon: any }> = {
  agendada: { label: "Agendada", variant: "default", icon: Clock },
  aprovada: { label: "Aprovada", variant: "success", icon: Check },
  gozada: { label: "Gozada", variant: "success", icon: Check },
  cancelada: { label: "Cancelada", variant: "destructive", icon: X },
};

export function FeriasPage() {
  const [ferias, setFerias] = useState<Ferias[]>([]);
  const [busca, setBusca] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFerias();
  }, [statusFilter]);

  async function loadFerias() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "todos") params.append("status", statusFilter);
      const { data } = await api.get(`/ferias?${params}`);
      setFerias(data.data || data || []);
    } catch (err) {
      console.error("Erro ao carregar férias", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = ferias.filter((f) =>
    !busca || f.colaboradores?.nome_completo?.toLowerCase().includes(busca.toLowerCase())
  );

  const stats = {
    agendadas: ferias.filter((f) => f.status === "agendada").length,
    aprovadas: ferias.filter((f) => f.status === "aprovada").length,
    gozadas: ferias.filter((f) => f.status === "gozada").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Férias</h1>
          <p className="text-gray-500">Gestão de férias dos colaboradores</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          Agendar Férias
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-gray-600">Agendadas</span>
            <Clock size={20} className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.agendadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-gray-600">Aprovadas</span>
            <Check size={20} className="text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.aprovadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-gray-600">Gozadas</span>
            <Check size={20} className="text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.gozadas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nome..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="agendada">Agendadas</SelectItem>
                <SelectItem value="aprovada">Aprovadas</SelectItem>
                <SelectItem value="gozada">Gozadas</SelectItem>
                <SelectItem value="cancelada">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Dias</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    Nenhum registro de férias encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((f) => {
                  const config = statusConfig[f.status] || statusConfig.agendada;
                  return (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.colaboradores?.nome_completo || "-"}</TableCell>
                      <TableCell className="font-mono text-sm">{f.colaboradores?.matricula || "-"}</TableCell>
                      <TableCell>{f.periodo_aquisitivo}</TableCell>
                      <TableCell>{formatDate(f.data_inicio)}</TableCell>
                      <TableCell>{formatDate(f.data_fim)}</TableCell>
                      <TableCell className="text-center">{f.dias_gozados}</TableCell>
                      <TableCell className="capitalize">{f.tipo}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </TableCell>
                      <TableCell>
                        {f.status === "agendada" && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="text-emerald-600">
                              <Check size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600">
                              <X size={16} />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
