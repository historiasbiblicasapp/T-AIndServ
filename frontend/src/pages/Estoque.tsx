import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Package, ArrowRightLeft, Boxes, X } from "lucide-react";
import { formatDateTime, cn } from "@/lib/utils";

interface Estoque {
  id: number;
  nome: string;
  descricao?: string;
  localizacao?: string;
  itens_count?: number;
}

interface ItemEstoque {
  id: number;
  codigo: string;
  nome: string;
  descricao?: string;
  categoria?: string;
  unidade: string;
  quantidade_atual: number;
  quantidade_minima: number;
  quantidade_maxima?: number;
  preco_unitario?: number;
  fornecedor?: string;
}

interface Movimentacao {
  id: number;
  data_movimentacao: string;
  tipo: string;
  quantidade: number;
  motivo?: string;
  responsavel?: string;
  itens_estoque?: { nome: string };
}

const statusBadge = (qtd: number, min: number): { label: string; variant: "destructive" | "warning" | "success" } => {
  if (qtd < min) return { label: "Baixo", variant: "destructive" };
  if (qtd < min * 1.5) return { label: "Atenção", variant: "warning" };
  return { label: "OK", variant: "success" };
};

export function EstoquePage() {
  const [activeTab, setActiveTab] = useState<"estoques" | "itens" | "movimentacoes">("estoques");

  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [selectedEstoque, setSelectedEstoque] = useState<Estoque | null>(null);
  const [itens, setItens] = useState<ItemEstoque[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);

  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [buscaMov, setBuscaMov] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  const [formEstoque, setFormEstoque] = useState({ nome: "", descricao: "", localizacao: "" });
  const [formItem, setFormItem] = useState({
    codigo: "", nome: "", descricao: "", categoria: "", unidade: "",
    quantidade_atual: 0, quantidade_minima: 0, quantidade_maxima: 0,
    preco_unitario: 0, fornecedor: "",
  });
  const [formMov, setFormMov] = useState({
    item_id: "", tipo: "entrada", quantidade: 0, motivo: "",
  });

  useEffect(() => {
    if (activeTab === "estoques") loadEstoques();
    else if (activeTab === "itens" && selectedEstoque) loadItens();
    else if (activeTab === "movimentacoes") loadMovimentacoes();
  }, [activeTab, busca, buscaMov, pagination.page, selectedEstoque]);

  async function loadEstoques() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (busca) params.append("busca", busca);
      const { data } = await api.get(`/estoque?${params}`);
      setEstoques(data.data);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch (err) {
      console.error("Erro ao carregar estoques", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadItens() {
    if (!selectedEstoque) return;
    setLoading(true);
    try {
      const params = busca ? `?busca=${encodeURIComponent(busca)}` : "";
      const { data } = await api.get(`/estoque/${selectedEstoque.id}/itens${params}`);
      setItens(data.data || data || []);
    } catch (err) {
      console.error("Erro ao carregar itens", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMovimentacoes() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (buscaMov) params.append("busca", buscaMov);
      const { data } = await api.get(`/estoque/itens/0/movimentacoes?${params}`);
      setMovimentacoes(data.data || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch (err) {
      console.error("Erro ao carregar movimentações", err);
    } finally {
      setLoading(false);
    }
  }

  async function saveEstoque() {
    setSaving(true);
    try {
      await api.post("/estoque", formEstoque);
      setFormEstoque({ nome: "", descricao: "", localizacao: "" });
      setShowForm(false);
      loadEstoques();
    } catch (err) {
      console.error("Erro ao salvar estoque", err);
    } finally {
      setSaving(false);
    }
  }

  async function saveItem() {
    if (!selectedEstoque) return;
    setSaving(true);
    try {
      await api.post(`/estoque/${selectedEstoque.id}/itens`, formItem);
      setFormItem({
        codigo: "", nome: "", descricao: "", categoria: "", unidade: "",
        quantidade_atual: 0, quantidade_minima: 0, quantidade_maxima: 0,
        preco_unitario: 0, fornecedor: "",
      });
      setShowForm(false);
      loadItens();
    } catch (err) {
      console.error("Erro ao salvar item", err);
    } finally {
      setSaving(false);
    }
  }

  async function saveMovimentacao() {
    setSaving(true);
    try {
      await api.post(`/estoque/itens/${formMov.item_id}/movimentacoes`, {
        tipo: formMov.tipo,
        quantidade: formMov.quantidade,
        motivo: formMov.motivo,
      });
      setFormMov({ item_id: "", tipo: "entrada", quantidade: 0, motivo: "" });
      setShowForm(false);
      loadMovimentacoes();
    } catch (err) {
      console.error("Erro ao salvar movimentação", err);
    } finally {
      setSaving(false);
    }
  }

  function selectEstoque(estoque: Estoque) {
    setSelectedEstoque(estoque);
    setActiveTab("itens");
    setBusca("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Estoque</h1>
          <p className="text-gray-500">Gestão de estoques, itens e movimentações</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant={activeTab === "estoques" ? "default" : "outline"} onClick={() => setActiveTab("estoques")}>
          <Boxes size={16} className="mr-2" />
          Estoques
        </Button>
        <Button variant={activeTab === "itens" ? "default" : "outline"} onClick={() => setActiveTab("itens")}>
          <Package size={16} className="mr-2" />
          Itens
        </Button>
        <Button variant={activeTab === "movimentacoes" ? "default" : "outline"} onClick={() => setActiveTab("movimentacoes")}>
          <ArrowRightLeft size={16} className="mr-2" />
          Movimentações
        </Button>
      </div>

      {activeTab === "estoques" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Buscar estoque..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-10" />
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
              {showForm ? "Cancelar" : "Novo Estoque"}
            </Button>
          </div>

          {showForm && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Novo Estoque</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome *</label>
                    <Input value={formEstoque.nome} onChange={(e) => setFormEstoque({ ...formEstoque, nome: e.target.value })} placeholder="Nome do estoque" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Descrição</label>
                    <Input value={formEstoque.descricao} onChange={(e) => setFormEstoque({ ...formEstoque, descricao: e.target.value })} placeholder="Descrição" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Localização</label>
                    <Input value={formEstoque.localizacao} onChange={(e) => setFormEstoque({ ...formEstoque, localizacao: e.target.value })} placeholder="Localização" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={saveEstoque} disabled={saving || !formEstoque.nome}>
                    {saving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="text-center py-8 text-gray-500">Carregando...</div>
          ) : estoques.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum estoque encontrado</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {estoques.map((estoque) => (
                <Card
                  key={estoque.id}
                  className={cn(
                    "hover:shadow-md transition-shadow cursor-pointer",
                    selectedEstoque?.id === estoque.id && "ring-2 ring-primary"
                  )}
                  onClick={() => selectEstoque(estoque)}
                >
                  <CardHeader className="flex flex-row items-start gap-3 pb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{estoque.nome}</h3>
                      {estoque.localizacao && <p className="text-sm text-gray-500 truncate">{estoque.localizacao}</p>}
                    </div>
                    {estoque.itens_count !== undefined && (
                      <Badge variant="secondary">{estoque.itens_count} itens</Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    {estoque.descricao && <p className="text-sm text-gray-600">{estoque.descricao}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "itens" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Itens {selectedEstoque ? `- ${selectedEstoque.nome}` : ""}</h3>
                {!selectedEstoque && <p className="text-sm text-gray-500">Selecione um estoque na aba Estoques</p>}
              </div>
              {selectedEstoque && (
                <Button onClick={() => setShowForm(!showForm)}>
                  {showForm ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                  {showForm ? "Cancelar" : "Novo Item"}
                </Button>
              )}
            </div>
            {selectedEstoque && (
              <div className="relative max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Buscar item..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-10" />
              </div>
            )}
          </CardHeader>
          <CardContent>
            {showForm && selectedEstoque && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-3">Novo Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Código *</label>
                    <Input value={formItem.codigo} onChange={(e) => setFormItem({ ...formItem, codigo: e.target.value })} placeholder="Código" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome *</label>
                    <Input value={formItem.nome} onChange={(e) => setFormItem({ ...formItem, nome: e.target.value })} placeholder="Nome" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Categoria</label>
                    <Input value={formItem.categoria} onChange={(e) => setFormItem({ ...formItem, categoria: e.target.value })} placeholder="Categoria" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Unidade *</label>
                    <Input value={formItem.unidade} onChange={(e) => setFormItem({ ...formItem, unidade: e.target.value })} placeholder="Ex: un, kg, m" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Qtd Atual</label>
                    <Input type="number" value={formItem.quantidade_atual} onChange={(e) => setFormItem({ ...formItem, quantidade_atual: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Qtd Mínima</label>
                    <Input type="number" value={formItem.quantidade_minima} onChange={(e) => setFormItem({ ...formItem, quantidade_minima: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Qtd Máxima</label>
                    <Input type="number" value={formItem.quantidade_maxima} onChange={(e) => setFormItem({ ...formItem, quantidade_maxima: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Preço Unitário</label>
                    <Input type="number" step="0.01" value={formItem.preco_unitario} onChange={(e) => setFormItem({ ...formItem, preco_unitario: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fornecedor</label>
                    <Input value={formItem.fornecedor} onChange={(e) => setFormItem({ ...formItem, fornecedor: e.target.value })} placeholder="Fornecedor" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Descrição</label>
                    <Input value={formItem.descricao} onChange={(e) => setFormItem({ ...formItem, descricao: e.target.value })} placeholder="Descrição" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={saveItem} disabled={saving || !formItem.codigo || !formItem.nome}>
                    {saving ? "Salvando..." : "Salvar Item"}
                  </Button>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Qtd Atual</TableHead>
                  <TableHead>Qtd Mínima</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">Carregando...</TableCell>
                  </TableRow>
                ) : itens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {selectedEstoque ? "Nenhum item encontrado" : "Selecione um estoque para ver os itens"}
                    </TableCell>
                  </TableRow>
                ) : (
                  itens.map((item) => {
                    const status = statusBadge(item.quantidade_atual, item.quantidade_minima);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                        <TableCell className="font-medium">{item.nome}</TableCell>
                        <TableCell>{item.categoria || "-"}</TableCell>
                        <TableCell>{item.quantidade_atual}</TableCell>
                        <TableCell>{item.quantidade_minima}</TableCell>
                        <TableCell>{item.unidade}</TableCell>
                        <TableCell>{item.preco_unitario ? `R$ ${item.preco_unitario.toFixed(2)}` : "-"}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "movimentacoes" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Movimentações</h3>
              <Button onClick={() => setShowForm(!showForm)}>
                {showForm ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                {showForm ? "Cancelar" : "Nova Movimentação"}
              </Button>
            </div>
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Buscar movimentação..." value={buscaMov} onChange={(e) => setBuscaMov(e.target.value)} className="pl-10" />
            </div>
          </CardHeader>
          <CardContent>
            {showForm && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-3">Nova Movimentação</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Item *</label>
                    <Input value={formMov.item_id} onChange={(e) => setFormMov({ ...formMov, item_id: e.target.value })} placeholder="ID do item" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo *</label>
                    <Select value={formMov.tipo} onValueChange={(v) => setFormMov({ ...formMov, tipo: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entrada">Entrada</SelectItem>
                        <SelectItem value="saida">Saída</SelectItem>
                        <SelectItem value="transferencia">Transferência</SelectItem>
                        <SelectItem value="ajuste">Ajuste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Quantidade *</label>
                    <Input type="number" value={formMov.quantidade} onChange={(e) => setFormMov({ ...formMov, quantidade: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Motivo</label>
                    <Input value={formMov.motivo} onChange={(e) => setFormMov({ ...formMov, motivo: e.target.value })} placeholder="Motivo" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={saveMovimentacao} disabled={saving || !formMov.item_id || !formMov.quantidade}>
                    {saving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">Carregando...</TableCell>
                  </TableRow>
                ) : movimentacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">Nenhuma movimentação encontrada</TableCell>
                  </TableRow>
                ) : (
                  movimentacoes.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell>{formatDateTime(mov.data_movimentacao)}</TableCell>
                      <TableCell>{mov.itens_estoque?.nome || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={mov.tipo === "entrada" ? "success" : mov.tipo === "saida" ? "destructive" : "secondary"}>
                          {mov.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>{mov.quantidade}</TableCell>
                      <TableCell>{mov.motivo || "-"}</TableCell>
                      <TableCell>{mov.responsavel || "-"}</TableCell>
                    </TableRow>
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
      )}
    </div>
  );
}
