import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  GraduationCap,
  Shield,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Package,
  Boxes,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/", permission: null },
  { label: "Colaboradores", icon: Users, path: "/colaboradores", permission: "colaboradores.listar" },
  { label: "Empresas", icon: Building2, path: "/empresas", permission: null },
  { label: "Férias", icon: Calendar, path: "/ferias", permission: "ferias.visualizar" },
  { label: "Treinamentos", icon: GraduationCap, path: "/treinamentos", permission: "treinamentos.listar" },
  { label: "Saúde/SSMT", icon: Shield, path: "/saude", permission: "aso.listar" },
  { label: "Auditoria", icon: FileText, path: "/auditoria", permission: "auditoria.visualizar" },
  { label: "Estoque", icon: Package, path: "/estoque", permission: null },
  { label: "Materiais", icon: Boxes, path: "/materiais", permission: null },
  { label: "Ordens de Serviço", icon: Wrench, path: "/os", permission: null },
  { label: "Usuários", icon: Settings, path: "/usuarios", permission: "usuarios.listar" },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();

  const filteredMenu = menuItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-gray-900 text-white transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-20",
          "hidden lg:flex"
        )}
      >
        <div className="flex items-center justify-between p-4">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
              <span className="text-lg font-bold">T&A Ind Serv</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
                <span className="text-lg font-bold">T&A Ind Serv</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <nav>
              {filteredMenu.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1",
                      isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
                    )}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-3 py-3 sm:px-4 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-600 p-1">
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <button className="relative text-gray-500 hover:text-gray-700 hidden sm:block">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.nome_completo?.charAt(0) || "?"}
              </div>
              <div className="hidden sm:block min-w-0">
                <p className="text-sm font-medium truncate max-w-[140px]">{user?.nome_completo}</p>
                <p className="text-xs text-gray-500 truncate max-w-[140px]">
                  {user?.roles?.map((r) => r.nome).join(", ")}
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
            </div>

            <button
              onClick={logout}
              className="text-gray-500 hover:text-red-600 transition-colors p-1"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
