import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { LoginPage } from "@/pages/Login";
import { DashboardPage } from "@/pages/Dashboard";
import { ColaboradoresPage } from "@/pages/Colaboradores";
import { EmpresasPage } from "@/pages/Empresas";
import { FeriasPage } from "@/pages/Ferias";
import { TreinamentosPage } from "@/pages/Treinamentos";
import { SaudePage } from "@/pages/Saude";
import { UsuariosPage } from "@/pages/Usuarios";
import { AuditoriaPage } from "@/pages/Auditoria";
import { EstoquePage } from "@/pages/Estoque";
import { MateriaisPage } from "@/pages/Materiais";
import { OrdensServicoPage } from "@/pages/OrdensServico";
import type { ReactNode } from "react";

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user ? <Navigate to="/" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/colaboradores" element={<ColaboradoresPage />} />
            <Route path="/empresas" element={<EmpresasPage />} />
            <Route path="/ferias" element={<FeriasPage />} />
            <Route path="/treinamentos" element={<TreinamentosPage />} />
            <Route path="/saude" element={<SaudePage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/auditoria" element={<AuditoriaPage />} />
            <Route path="/estoque" element={<EstoquePage />} />
            <Route path="/materiais" element={<MateriaisPage />} />
            <Route path="/os" element={<OrdensServicoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
