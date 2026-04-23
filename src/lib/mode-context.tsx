import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { decodeJwt } from "@/lib/api-client";

export type Mode = "user" | "developer";
export type Theme = "light" | "dark";
export type Role = "user" | "admin";

export interface CurrentUser {
  id: string;
  username: string;
  role: Role;
}

interface AppCtx {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  token: string | null;
  setToken: (t: string | null) => void;
  user: CurrentUser | null;
  isAdmin: boolean;
  logout: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

function userFromToken(token: string | null): CurrentUser | null {
  if (!token) return null;
  const p = decodeJwt(token);
  if (!p) return null;
  if (p.exp < Date.now() / 1000) return null;
  return { id: p.sub, username: p.username, role: p.role };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("user");
  const [theme, setTheme] = useState<Theme>("light");
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);

  // hydrate from localStorage (client-only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.localStorage.getItem("portfolio-mode") as Mode | null;
    const t = window.localStorage.getItem("portfolio-theme") as Theme | null;
    const tk = window.localStorage.getItem("portfolio-token");
    if (m) setMode(m);
    if (t) setTheme(t);
    if (tk) {
      setTokenState(tk);
      setUser(userFromToken(tk));
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("portfolio-mode", mode);
  }, [mode]);

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    setUser(userFromToken(t));
    if (typeof window !== "undefined") {
      if (t) window.localStorage.setItem("portfolio-token", t);
      else window.localStorage.removeItem("portfolio-token");
    }
  }, []);

  const logout = useCallback(() => setToken(null), [setToken]);

  return (
    <Ctx.Provider
      value={{
        mode,
        setMode,
        toggleMode: () => setMode(mode === "user" ? "developer" : "user"),
        theme,
        setTheme,
        toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
        token,
        setToken,
        user,
        isAdmin: user?.role === "admin",
        logout,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}
