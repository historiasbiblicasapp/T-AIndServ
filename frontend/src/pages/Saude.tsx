import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, AlertTriangle, CheckCircle, XCircle, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ASO {
  id: number;
  colaborador_id: number;
  tipo_aso: string;
  data_exame: string;
  data_validade: string;
  medico_resp?: string;
  resultado: string;
  colaboradores?: { nome_completo: string; matricula: string };
}

interface ExamePeriodico {
  id: number;
  colaborador_id: number;
  tipo_exame: string;
  data_realizacao: string;
  data_validade: string;
  resultado?: string;
  colaboradores?: { nome_completo: string; matricula: string };
}

interface CAT {
  id: number;
  colaborador_id: number;
  data_acidente: string;
  tipo_acidente: string;
  natureza_lesao?: string;
  mortal: boolean;
  cat_numero?: string;
  colaboradores?: { nome_completo: string; matricula: string };
}

const resultadoColors: Record<string, "success" | "destructive" | "warning"> = {
  apto: "success",
  inapto: "destructive",
  apto_com_restricao: "warning",
};

export function SaudePage() {
  const [activeTab, setActiveTab] = useState<"aso" | "periodicos" | "cat">("aso");
  const [asos, setAsos] = useState<ASO[]>([]);
  const [periodicos, setPeriodicos] = useState<ExamePeriodico[]>([]);
  const [cats, setCats] = useState<CAT[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === "aso") {
        const { data } = await api.get("/saude/aso");
        setAsos(data.data || data || []);
      } else if (activeTab === "periodicos") {
        const { data } = await api.get("/saude/exames");
        setPeriodicos(data.data || data || []);
      } else {
        const { data } = await api.get("/saude/cat");
        setCats(data.data || data || []);
      }
    } catch (err) {
      console.error("Erro ao carregar dados de saúde", err);
    } finally {
      setLoading(false);
    }
  }

  const getFilteredData = () => {
    const term = busca.toLowerCase();
    if (activeTab === "aso") {
      return asos.filter((a) => !term || a.colaboradores?.nome_completo?.toLowerCase().includes(term));
    }
    if (activeTab === "periodicos") {
      return periodicos.filter((p) => !term || p.colaboradores?.nome_completo?.toLowerCase().includes(term));
    }
    return cats.filter((c) => !term || c.colaboradores?.nome_completo?.toLowerCase().includes(term));
  };

  const filtered = getFilteredData();

  const stats = {
    asoAptos: asos.filter((a) => a.resultado === "apto").length,
    asoInaptos: asos.filter((a) => a.resultado === "inapto").length,
    asoVencendo: asos.filter((a) => {
      const diff = new Date(a.data_validade).getTime() - Date.now();
      return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
    }).length,
    totalCATs: cats.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Saúde e Segurança do Trabalho</h1>
          <p className="text-gray-500">ASOs, exames periódicos e CATs</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          {activeTab === "aso" && "Novo ASO"}
          {activeTab === "periodicos" && "Novo Exame"}
          {activeTab === "cat" && "Nova CAT"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-gray-600">ASOs Aptos</span>
            <CheckCircle size={20} className="text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.asoAptos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-gray-600">ASOs Inaptos</span>
            <XCircle size={20} className="text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.asoInaptos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-gray-600">ASOs Vencendo</span>
            <AlertTriangle size={20} className="text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.asoVencendo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-gray-600">Total CATs</span>
            <FileText size={20} className="text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCATs}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 mb-4">
        <Button variant={activeTab === "aso" ? "default" : "outline"} onClick={() => setActiveTab("aso")}>
          ASOs
        </Button>
        <Button variant={activeTab === "periodicos" ? "default" : "outline"} onClick={() => setActiveTab("periodicos")}>
          Exames Periódicos
        </Button>
        <Button variant={activeTab === "cat" ? "default" : "outline"} onClick={() => setActiveTab("cat")}>
          CATs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nome do colaborador..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "aso" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data Exame</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">Carregando...</TableCell>
                  </TableRow>
                ) : asos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">Nenhum ASO encontrado</TableCell>
                  </TableRow>
                ) : (
                  (filtered as ASO[]).map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.colaboradores?.nome_completo || "-"}</TableCell>
                      <TableCell className="font-mono text-sm">{a.colaboradores?.matricula || "-"}</TableCell>
                      <TableCell className="capitalize">{a.tipo_aso.replace("_", " ")}</TableCell>
                      <TableCell>{formatDate(a.data_exame)}</TableCell>
                      <TableCell>{formatDate(a.data_validade)}</TableCell>
                      <TableCell>{a.medico_resp || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={resultadoColors[a.resultado] || "default"} className="capitalize">
                          {a.resultado.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {activeTab === "periodicos" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Tipo de Exame</TableHead>
                  <TableHead>Data Realização</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">Carregando...</TableCell>
                  </TableRow>
                ) : periodicos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">Nenhum exame encontrado</TableCell>
                  </TableRow>
                ) : (
                  (filtered as ExamePeriodico[]).map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.colaboradores?.nome_completo || "-"}</TableCell>
                      <TableCell className="font-mono text-sm">{p.colaboradores?.matricula || "-"}</TableCell>
                      <TableCell>{p.tipo_exame}</TableCell>
                      <TableCell>{formatDate(p.data_realizacao)}</TableCell>
                      <TableCell>{formatDate(p.data_validade)}</TableCell>
                      <TableCell>{p.resultado || "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {activeTab === "cat" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Natureza da Lesão</TableHead>
                  <TableHead>CAT Nº</TableHead>
                  <TableHead>Mortal</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">Carregando...</TableCell>
                  </TableRow>
                ) : cats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">Nenhuma CAT encontrada</TableCell>
                  </TableRow>
                ) : (
                  (filtered as CAT[]).map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.colaboradores?.nome_completo || "-"}</TableCell>
                      <TableCell className="font-mono text-sm">{c.colaboradores?.matricula || "-"}</TableCell>
                      <TableCell>{formatDate(c.data_acidente)}</TableCell>
                      <TableCell className="capitalize">{c.tipo_acidente.replace("_", " ")}</TableCell>
                      <TableCell>{c.natureza_lesao || "-"}</TableCell>
                      <TableCell>{c.cat_numero || "-"}</TableCell>
                      <TableCell>
                        {c.mortal ? (
                          <Badge variant="destructive">Sim</Badge>
                        ) : (
                          <span className="text-gray-400">Não</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Ver</Button>
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
