import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, GraduationCap, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Treinamento {
  id: number;
  nome: string;
  descricao?: string;
  carga_horaria?: number;
  tipo: string;
  norma_nr?: string;
  validade_meses?: number;
  obrigatorio: boolean;
}

interface ColabTreinamento {
  id: number;
  data_realizacao: string;
  data_validade?: string;
  nota?: number;
  aprovado?: boolean;
  colaboradores?: { nome_completo: string; matricula: string };
  cursos_treinamentos?: { nome: string; norma_nr?: string };
}

const tipoColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
  interno: "default",
  externo: "secondary",
  online: "success",
  obrigatorio: "warning",
  nr: "destructive" as any,
};

export function TreinamentosPage() {
  const [activeTab, setActiveTab] = useState<"cursos" | "realizados">("cursos");
  const [cursos, setCursos] = useState<Treinamento[]>([]);
  const [realizados, setRealizados] = useState<ColabTreinamento[]>([]);
  const [busca, setBusca] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tipoFilter, activeTab]);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === "cursos") {
        const { data } = await api.get("/treinamentos");
        setCursos(data.data || data || []);
      } else {
        const { data } = await api.get("/treinamentos/realizados");
        setRealizados(data.data || data || []);
      }
    } catch (err) {
      console.error("Erro ao carregar treinamentos", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredCursos = cursos.filter((c) => {
    const matchBusca = !busca || c.nome.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = tipoFilter === "todos" || c.tipo === tipoFilter;
    return matchBusca && matchTipo;
  });

  const stats = {
    total: cursos.length,
    obrigatorios: cursos.filter((c) => c.obrigatorio).length,
    comNR: cursos.filter((c) => c.norma_nr).length,
    vencendo: realizados.filter((r) => {
      if (!r.data_validade) return false;
      const diff = new Date(r.data_validade).getTime() - Date.now();
      return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
    }).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Treinamentos</h1>
          <p className="text-gray-500">Gestão de cursos e treinamentos</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          Novo Treinamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-gray-600">Total</span>
            <GraduationCap size={20} className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-gray-600">Obrigatórios</span>
            <AlertTriangle size={20} className="text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.obrigatorios}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-gray-600">Normas NR</span>
            <CheckCircle size={20} className="text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.comNR}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-gray-600">Vencendo (30d)</span>
            <Clock size={20} className="text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.vencendo}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === "cursos" ? "default" : "outline"}
          onClick={() => setActiveTab("cursos")}
        >
          Cursos Disponíveis
        </Button>
        <Button
          variant={activeTab === "realizados" ? "default" : "outline"}
          onClick={() => setActiveTab("realizados")}
        >
          Realizados
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar treinamento..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === "cursos" && (
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="obrigatorio">Obrigatório</SelectItem>
                  <SelectItem value="nr">NR</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "cursos" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Carga Horária</TableHead>
                  <TableHead>Norma NR</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Obrigatório</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredCursos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhum treinamento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCursos.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.nome}</TableCell>
                      <TableCell>
                        <Badge variant={tipoColors[c.tipo] || "default"} className="capitalize">
                          {c.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>{c.carga_horaria ? `${c.carga_horaria}h` : "-"}</TableCell>
                      <TableCell>{c.norma_nr || "-"}</TableCell>
                      <TableCell>{c.validade_meses ? `${c.validade_meses} meses` : "-"}</TableCell>
                      <TableCell>
                        {c.obrigatorio ? (
                          <Badge variant="warning">Sim</Badge>
                        ) : (
                          <span className="text-gray-400">Não</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Matricular</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Treinamento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead>Aprovado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : realizados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhum treinamento realizado
                    </TableCell>
                  </TableRow>
                ) : (
                  realizados.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.colaboradores?.nome_completo || "-"}</TableCell>
                      <TableCell className="font-mono text-sm">{r.colaboradores?.matricula || "-"}</TableCell>
                      <TableCell>{r.cursos_treinamentos?.nome || "-"}</TableCell>
                      <TableCell>{formatDate(r.data_realizacao)}</TableCell>
                      <TableCell>{r.data_validade ? formatDate(r.data_validade) : "-"}</TableCell>
                      <TableCell>{r.nota?.toFixed(1) || "-"}</TableCell>
                      <TableCell>
                        {r.aprovado === true && <Badge variant="success">Sim</Badge>}
                        {r.aprovado === false && <Badge variant="destructive">Não</Badge>}
                        {r.aprovado === null && <span className="text-gray-400">-</span>}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
