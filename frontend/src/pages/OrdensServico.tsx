import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, ChevronDown, ChevronUp, X, Wrench } from "lucide-react";
import { formatDate, formatDateTime, cn } from "@/lib/utils";

interface OrdemServico {
  id: number;
  numero: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  prioridade: string;
  status: string;
  solicitante?: string;
  setor_solicitante?: string;
  data_abertura: string;
  data_prevista?: string;
  empresas?: { nome_fantasia: string };
}

interface Historico {
  id: number;
  data: string;
  descricao: string;
  autor?: string;
}

interface Empresa {
  id: number;
  nome_fantasia: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "success" | "warning"> = {
  aberta: "default",
  em_andamento: "warning",
  parada: "destructive",
  concluida: "success",
  cancelada: "destructive",
};

const prioridadeVariant: Record<string, "secondary" | "default" | "warning" | "destructive"> = {
  baixa: "secondary",
  media: "default",
  alta: "warning",
  urgente: "destructive",
};

const statusLabel: Record<string, string> = {
  aberta: "Aberta",
  em_andamento: "Em Andamento",
  parada: "Parada",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export function OrdensServicoPage() {
  const [activeFilter, setActiveFilter] = useState("todas");
  const [osList, setOsList] = useState<OrdemServico[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [historicoNote, setHistoricoNote] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  const [form, setForm] = useState({
    titulo: "", descricao: "", tipo: "manutencao", prioridade: "media",
    empresa_id: "", solicitante: "", setor_solicitante: "", data_prevista: "",
  });

  useEffect(() => {
    loadOS();
    loadEmpresas();
  }, [pagination.page, busca, activeFilter]);

  async function loadOS() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (busca) params.append("busca", busca);
      if (activeFilter !== "todas") params.append("status", activeFilter);

      const { data } = await api.get(`/os?${params}`);
      setOsList(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Erro ao carregar ordens de serviço", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadEmpresas() {
    try {
      const { data } = await api.get("/estrutura/empresas");
      setEmpresas(data.data || data || []);
    } catch (err) {
      console.error("Erro ao carregar empresas", err);
    }
  }

  async function saveOS() {
    setSaving(true);
    try {
      await api.post("/os", form);
      setForm({ titulo: "", descricao: "", tipo: "manutencao", prioridade: "media", empresa_id: "", solicitante: "", setor_solicitante: "", data_prevista: "" });
      setShowForm(false);
      loadOS();
    } catch (err) {
      console.error("Erro ao salvar OS", err);
    } finally {
      setSaving(false);
    }
  }

  async function toggleExpand(os: OrdemServico) {
    if (expandedId === os.id) {
      setExpandedId(null);
      setHistorico([]);
      return;
    }
    setExpandedId(os.id);
    try {
      const { data } = await api.get(`/os/${os.id}/historico`);
      setHistorico(data.data || data || []);
    } catch (err) {
      console.error("Erro ao carregar histórico", err);
    }
  }

  async function addHistorico(osId: number) {
    if (!historicoNote.trim()) return;
    try {
      await api.post(`/os/${osId}/historico`, { descricao: historicoNote });
      setHistoricoNote("");
      const { data } = await api.get(`/os/${osId}/historico`);
      setHistorico(data.data || data || []);
    } catch (err) {
      console.error("Erro ao adicionar histórico", err);
    }
  }

  async function changeStatus(osId: number, newStatus: string) {
    try {
      await api.patch(`/os/${osId}/status`, { status: newStatus });
      loadOS();
    } catch (err) {
      console.error("Erro ao alterar status", err);
    }
  }

  const filters = [
    { key: "todas", label: "Todas" },
    { key: "aberta", label: "Abertas" },
    { key: "em_andamento", label: "Em Andamento" },
    { key: "concluida", label: "Concluídas" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
          <p className="text-gray-500">{pagination.total} ordens cadastradas</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
          {showForm ? "Cancelar" : "Nova OS"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Nova Ordem de Serviço</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Título *</label>
                <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título da OS" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo</label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="corretiva">Corretiva</SelectItem>
                    <SelectItem value="preventiva">Preventiva</SelectItem>
                    <SelectItem value="emergencial">Emergencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Prioridade</label>
                <Select value={form.prioridade} onValueChange={(v) => setForm({ ...form, prioridade: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Empresa</label>
                <Select value={form.empresa_id} onValueChange={(v) => setForm({ ...form, empresa_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                  <SelectContent>
                    {empresas.map((e) => (
                      <SelectItem key={e.id} value={String(e.id)}>{e.nome_fantasia}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Solicitante</label>
                <Input value={form.solicitante} onChange={(e) => setForm({ ...form, solicitante: e.target.value })} placeholder="Solicitante" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Setor Solicitante</label>
                <Input value={form.setor_solicitante} onChange={(e) => setForm({ ...form, setor_solicitante: e.target.value })} placeholder="Setor" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Data Prevista</label>
                <Input type="date" value={form.data_prevista} onChange={(e) => setForm({ ...form, data_prevista: e.target.value })} />
              </div>
              <div className="md:col-span-3">
                <label className="text-sm font-medium text-gray-600">Descrição</label>
                <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição detalhada" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={saveOS} disabled={saving || !form.titulo}>
                {saving ? "Salvando..." : "Salvar OS"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        {filters.map((f) => (
          <Button key={f.key} variant={activeFilter === f.key ? "default" : "outline"} onClick={() => { setActiveFilter(f.key); setPagination((p) => ({ ...p, page: 1 })); }}>
            {f.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Buscar OS..." value={busca} onChange={(e) => { setBusca(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Abertura</TableHead>
                <TableHead>Prevista</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">Carregando...</TableCell>
                </TableRow>
              ) : osList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">Nenhuma ordem de serviço encontrada</TableCell>
                </TableRow>
              ) : (
                osList.map((os) => (
                  <>
                    <TableRow
                      key={os.id}
                      className={cn("cursor-pointer", expandedId === os.id && "bg-muted/50")}
                      onClick={() => toggleExpand(os)}
                    >
                      <TableCell>
                        {expandedId === os.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{os.numero}</TableCell>
                      <TableCell className="font-medium">{os.titulo}</TableCell>
                      <TableCell className="capitalize">{os.tipo}</TableCell>
                      <TableCell>
                        <Badge variant={prioridadeVariant[os.prioridade] || "default"} className="capitalize">{os.prioridade}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[os.status] || "default"}>{statusLabel[os.status] || os.status}</Badge>
                      </TableCell>
                      <TableCell>{os.solicitante || "-"}</TableCell>
                      <TableCell>{formatDate(os.data_abertura)}</TableCell>
                      <TableCell>{os.data_prevista ? formatDate(os.data_prevista) : "-"}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          {os.status !== "concluida" && os.status !== "cancelada" && (
                            <>
                              {os.status === "aberta" && (
                                <Button variant="ghost" size="sm" onClick={() => changeStatus(os.id, "em_andamento")}>
                                  <Wrench size={14} />
                                </Button>
                              )}
                              {os.status === "em_andamento" && (
                                <Button variant="ghost" size="sm" onClick={() => changeStatus(os.id, "concluida")}>
                                  ✓
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedId === os.id && (
                      <TableRow key={`${os.id}-detail`}>
                        <TableCell colSpan={10} className="p-4 bg-gray-50">
                          <div className="space-y-4">
                            {os.descricao && (
                              <div>
                                <h4 className="font-semibold text-sm text-gray-600">Descrição</h4>
                                <p className="text-sm">{os.descricao}</p>
                              </div>
                            )}
                            {os.setor_solicitante && (
                              <p className="text-sm text-gray-600"><span className="font-medium">Setor:</span> {os.setor_solicitante}</p>
                            )}
                            {os.empresas?.nome_fantasia && (
                              <p className="text-sm text-gray-600"><span className="font-medium">Empresa:</span> {os.empresas.nome_fantasia}</p>
                            )}

                            <div>
                              <h4 className="font-semibold text-sm text-gray-600 mb-2">Histórico</h4>
                              {historico.length === 0 ? (
                                <p className="text-sm text-gray-400">Nenhum registro</p>
                              ) : (
                                <div className="space-y-2">
                                  {historico.map((h) => (
                                    <div key={h.id} className="p-2 bg-white rounded border text-sm">
                                      <p className="text-gray-500 text-xs">{formatDateTime(h.data)} {h.autor ? `- ${h.autor}` : ""}</p>
                                      <p>{h.descricao}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="flex gap-2 mt-2">
                                <Input placeholder="Adicionar nota..." value={historicoNote} onChange={(e) => setHistoricoNote(e.target.value)} />
                                <Button size="sm" onClick={() => addHistorico(os.id)} disabled={!historicoNote.trim()}>Adicionar</Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">Página {pagination.page} de {pagination.pages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}>
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
