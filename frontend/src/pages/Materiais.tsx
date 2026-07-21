import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";

interface Material {
  id: number;
  codigo: string;
  nome: string;
  descricao?: string;
  categoria: string;
  unidade: string;
  preco_unitario: number;
  estoque_minimo: number;
  fornecedor?: string;
  ativo: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const categorias = [
  { value: "todos", label: "Todas" },
  { value: "geral", label: "Geral" },
  { value: "eletrico", label: "Elétrico" },
  { value: "hidraulico", label: "Hidráulico" },
  { value: "mecanico", label: "Mecânico" },
  { value: "epi", label: "EPI" },
  { value: "limpeza", label: "Limpeza" },
  { value: "outros", label: "Outros" },
];

export function MateriaisPage() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [busca, setBusca] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    codigo: "", nome: "", descricao: "", categoria: "geral",
    unidade: "", preco_unitario: 0, estoque_minimo: 0, fornecedor: "",
  });

  useEffect(() => {
    loadMateriais();
  }, [pagination.page, busca, categoriaFilter]);

  async function loadMateriais() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });
      if (busca) params.append("busca", busca);
      if (categoriaFilter && categoriaFilter !== "todos") params.append("categoria", categoriaFilter);

      const { data } = await api.get(`/materiais?${params}`);
      setMateriais(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Erro ao carregar materiais", err);
    } finally {
      setLoading(false);
    }
  }

  async function saveMaterial() {
    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/materiais/${editingId}`, form);
      } else {
        await api.post("/materiais", form);
      }
      resetForm();
      loadMateriais();
    } catch (err) {
      console.error("Erro ao salvar material", err);
    } finally {
      setSaving(false);
    }
  }

  async function deleteMaterial(id: number) {
    if (!confirm("Deseja excluir este material?")) return;
    try {
      await api.delete(`/materiais/${id}`);
      loadMateriais();
    } catch (err) {
      console.error("Erro ao excluir material", err);
    }
  }

  function startEdit(material: Material) {
    setEditingId(material.id);
    setForm({
      codigo: material.codigo,
      nome: material.nome,
      descricao: material.descricao || "",
      categoria: material.categoria,
      unidade: material.unidade,
      preco_unitario: material.preco_unitario,
      estoque_minimo: material.estoque_minimo,
      fornecedor: material.fornecedor || "",
    });
    setShowForm(true);
  }

  function resetForm() {
    setForm({ codigo: "", nome: "", descricao: "", categoria: "geral", unidade: "", preco_unitario: 0, estoque_minimo: 0, fornecedor: "" });
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Materiais</h1>
          <p className="text-gray-500">{pagination.total} materiais cadastrados</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
          {showForm ? "Cancelar" : "Novo Material"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">{editingId ? "Editar Material" : "Novo Material"}</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Código *</label>
                <Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} placeholder="Código" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nome *</label>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Categoria</label>
                <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.filter((c) => c.value !== "todos").map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Unidade *</label>
                <Input value={form.unidade} onChange={(e) => setForm({ ...form, unidade: e.target.value })} placeholder="Ex: un, kg, m" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Preço Unitário</label>
                <Input type="number" step="0.01" value={form.preco_unitario} onChange={(e) => setForm({ ...form, preco_unitario: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estoque Mínimo</label>
                <Input type="number" value={form.estoque_minimo} onChange={(e) => setForm({ ...form, estoque_minimo: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fornecedor</label>
                <Input value={form.fornecedor} onChange={(e) => setForm({ ...form, fornecedor: e.target.value })} placeholder="Fornecedor" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Descrição</label>
                <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição" />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
              <Button onClick={saveMaterial} disabled={saving || !form.codigo || !form.nome}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Buscar material..." value={busca} onChange={(e) => { setBusca(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }} className="pl-10" />
            </div>
            <Select value={categoriaFilter} onValueChange={(v) => { setCategoriaFilter(v); setPagination((p) => ({ ...p, page: 1 })); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque Mín.</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">Carregando...</TableCell>
                </TableRow>
              ) : materiais.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">Nenhum material encontrado</TableCell>
                </TableRow>
              ) : (
                materiais.map((mat) => (
                  <TableRow key={mat.id}>
                    <TableCell className="font-mono text-sm">{mat.codigo}</TableCell>
                    <TableCell className="font-medium">{mat.nome}</TableCell>
                    <TableCell className="capitalize">{mat.categoria}</TableCell>
                    <TableCell>{mat.unidade}</TableCell>
                    <TableCell>{mat.preco_unitario ? `R$ ${mat.preco_unitario.toFixed(2)}` : "-"}</TableCell>
                    <TableCell>{mat.estoque_minimo}</TableCell>
                    <TableCell>{mat.fornecedor || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={mat.ativo ? "success" : "destructive"}>
                        {mat.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(mat)}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMaterial(mat.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
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
    </div>
  );
}
