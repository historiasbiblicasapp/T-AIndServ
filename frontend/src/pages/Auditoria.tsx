import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface Auditoria {
  id: number;
  tabela: string;
  campo?: string;
  registro_id?: number;
  valor_antigo?: string;
  valor_novo?: string;
  tipo_operacao: string;
  ip_address?: string;
  criado_em: string;
  usuarios?: { nome_completo: string; email: string };
}

const operacaoColors: Record<string, "success" | "warning" | "destructive"> = {
  INSERT: "success",
  UPDATE: "warning",
  DELETE: "destructive",
};

export function AuditoriaPage() {
  const [registros, setRegistros] = useState<Auditoria[]>([]);
  const [busca, setBusca] = useState("");
  const [operacaoFilter, setOperacaoFilter] = useState("todas");
  const [tabelaFilter, setTabelaFilter] = useState("todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditoria();
  }, [operacaoFilter, tabelaFilter]);

  async function loadAuditoria() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (operacaoFilter !== "todas") params.append("operacao", operacaoFilter);
      if (tabelaFilter !== "todas") params.append("tabela", tabelaFilter);
      const { data } = await api.get(`/auditoria?${params}`);
      setRegistros(data.data || data || []);
    } catch (err) {
      console.error("Erro ao carregar auditoria", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = registros.filter((r) => {
    if (!busca) return true;
    const term = busca.toLowerCase();
    return (
      r.tabela?.toLowerCase().includes(term) ||
      r.usuarios?.nome_completo?.toLowerCase().includes(term) ||
      r.usuarios?.email?.toLowerCase().includes(term)
    );
  });

  const tabelas = [...new Set(registros.map((r) => r.tabela))].sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Auditoria</h1>
          <p className="text-gray-500">Histórico de alterações do sistema</p>
        </div>
        <Button variant="outline">
          <Download size={16} className="mr-2" />
          Exportar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por tabela, usuário..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={operacaoFilter} onValueChange={setOperacaoFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Operação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="INSERT">Inserção</SelectItem>
                <SelectItem value="UPDATE">Atualização</SelectItem>
                <SelectItem value="DELETE">Exclusão</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tabelaFilter} onValueChange={setTabelaFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tabela" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {tabelas.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead>Tabela</TableHead>
                <TableHead>Campo</TableHead>
                <TableHead>Registro ID</TableHead>
                <TableHead>Valor Antigo</TableHead>
                <TableHead>Valor Novo</TableHead>
                <TableHead>IP</TableHead>
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
                    Nenhum registro de auditoria encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDateTime(r.criado_em)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{r.usuarios?.nome_completo || "-"}</p>
                        <p className="text-xs text-gray-500">{r.usuarios?.email || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={operacaoColors[r.tipo_operacao] || "default"}>
                        {r.tipo_operacao}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{r.tabela}</TableCell>
                    <TableCell className="text-sm">{r.campo || "-"}</TableCell>
                    <TableCell className="text-sm">{r.registro_id || "-"}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate" title={r.valor_antigo || ""}>
                      {r.valor_antigo || "-"}
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate" title={r.valor_novo || ""}>
                      {r.valor_novo || "-"}
                    </TableCell>
                    <TableCell className="text-sm font-mono">{r.ip_address || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
