import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, MapPin, Search } from "lucide-react";

interface Empresa {
  id: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  cidade?: string;
  estado?: string;
  ativa: boolean;
}

export function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmpresas();
  }, [busca]);

  async function loadEmpresas() {
    setLoading(true);
    try {
      const params = busca ? `?busca=${encodeURIComponent(busca)}` : "";
      const { data } = await api.get(`/estrutura/empresas${params}`);
      setEmpresas(data.data);
    } catch (err) {
      console.error("Erro ao carregar empresas", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Empresas</h1>
          <p className="text-gray-500">{empresas.length} empresas cadastradas</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          Nova Empresa
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar empresa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-gray-500">
              Carregando...
            </CardContent>
          </Card>
        ) : empresas.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-gray-500">
              Nenhuma empresa encontrada
            </CardContent>
          </Card>
        ) : (
          empresas.map((empresa) => (
            <Card key={empresa.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-start gap-3 pb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{empresa.nome_fantasia}</h3>
                  <p className="text-sm text-gray-500 truncate">{empresa.razao_social}</p>
                </div>
                <Badge variant={empresa.ativa ? "success" : "destructive"}>
                  {empresa.ativa ? "Ativa" : "Inativa"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">CNPJ:</span> {empresa.cnpj}
                  </p>
                  {empresa.cidade && empresa.estado && (
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin size={14} />
                      {empresa.cidade}/{empresa.estado}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
