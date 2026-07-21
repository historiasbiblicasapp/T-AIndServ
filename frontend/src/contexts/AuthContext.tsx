import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "@/lib/api";

interface User {
  id: string;
  email: string;
  nome_completo: string;
  avatar_url?: string;
  roles: { id: number; nome: string; nivel: number }[];
  permissoes: { chave: string; modulo: string }[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (chave: string) => boolean;
  hasRole: (nome: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadProfile() {
    try {
      const { data } = await api.get("/auth/profile");
      setUser(data);
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("access_token", data.session.access_token);
    localStorage.setItem("refresh_token", data.session.refresh_token);
    setUser(data.user);
    await loadProfile();
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  }

  function hasPermission(chave: string): boolean {
    if (!user) return false;
    if (user.roles.some((r) => r.nome === "admin")) return true;
    return user.permissoes.some((p) => p.chave === chave);
  }

  function hasRole(nome: string): boolean {
    if (!user) return false;
    return user.roles.some((r) => r.nome === nome);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
