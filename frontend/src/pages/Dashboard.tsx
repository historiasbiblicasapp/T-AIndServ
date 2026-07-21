import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Calendar, AlertTriangle } from "lucide-react";

interface DashboardData {
  totalColaboradores: number;
  totalEmpresas: number;
  feriasPendentes: number;
  asoVencendo: number;
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalColaboradores: 0,
    totalEmpresas: 0,
    feriasPendentes: 0,
    asoVencendo: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [colabRes, empRes] = await Promise.all([
        api.get("/colaboradores?limit=1"),
        api.get("/estrutura/empresas"),
      ]);
      setData({
        totalColaboradores: colabRes.data.pagination?.total || 0,
        totalEmpresas: empRes.data.total || 0,
        feriasPendentes: 0,
        asoVencendo: 0,
      });
    } catch (err) {
      console.error("Erro ao carregar dashboard", err);
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      title: "Colaboradores Ativos",
      value: data.totalColaboradores,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Empresas Cadastradas",
      value: data.totalEmpresas,
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Férias Pendentes",
      value: data.feriasPendentes,
      icon: Calendar,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "ASOs Vencendo",
      value: data.asoVencendo,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon size={20} className={card.color} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? "..." : card.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Aniversariantes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">Nenhum aniversariante próximo.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Treinamentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">Nenhum treinamento pendente.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
