import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/mode-context";
import {
  LayoutDashboard,
  FolderKanban,
  GraduationCap,
  LogOut,
  ArrowLeft,
  Sparkles,
  Command,
  Mail,
  Menu,
  X,
  User,
  Settings,
  Bell,
  ArrowUpRight,
} from "lucide-react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban, exact: false },
  { to: "/admin/education", label: "Education", icon: GraduationCap, exact: false },
  { to: "/admin/messages", label: "Messages", icon: Mail, exact: false },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, logout, theme } = useApp();
  const loc = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate({ to: "/admin/login", search: {} as any });
  }

  useEffect(() => {
    setMobileOpen(false);
  }, [loc.pathname]);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar - Desktop */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r-4 border-border bg-card md:flex">
        <div className="flex items-center gap-4 px-8 py-10">
          <div className="flex h-12 w-12 items-center justify-center border-4 border-border bg-foreground text-background shadow-[3px_3px_0px_0px_var(--shadow-blue)]">
            <Command className="h-6 w-6" />
          </div>
          <div className="flex flex-col leading-[0.9]">
            <span className="text-xl font-black tracking-tighter uppercase">Admin</span>
            <span className="mt-1 text-[9px] font-black uppercase tracking-[0.3em] text-primary">Core_v2.5</span>
          </div>
        </div>

        <nav className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar">
          <div className="mb-6 px-2 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">Navigation_Nodes</div>
          <ul className="space-y-3">
            {NAV.map((n) => {
              const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
              return (
                <li key={n.to}>
                  <Link to={n.to}
                    className={`group flex items-center justify-between border-4 border-border px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${
                      active 
                        ? "bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_var(--shadow-blue)] translate-x-1 -translate-y-1" 
                        : "bg-background text-foreground hover:bg-primary/10 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--shadow-blue)]"
                    }`}>
                    <div className="flex items-center gap-3">
                      <n.icon className={`h-4 w-4 transition-transform group-hover:scale-110`} />
                      <span>{n.label}</span>
                    </div>
                    {active && <div className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-12 mb-6 px-2 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">Security_Out</div>
          <Link to="/"
            className="group flex items-center gap-3 border-4 border-border bg-background px-5 py-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground transition-all hover:bg-surface hover:text-foreground hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
            <ArrowLeft className="h-4 w-4" />
            <span>Main_System</span>
          </Link>
        </nav>

        <div className="p-6">
          <div className="border-4 border-border bg-surface p-4 shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-border bg-foreground text-xs font-black text-background">
                {user?.username?.[0] ?? "?"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-black uppercase tracking-tight text-foreground">{user?.username ?? "Admin"}</div>
                <div className="text-[9px] font-black text-primary uppercase tracking-widest">Master_Admin</div>
              </div>
              <button onClick={handleLogout} className="flex h-8 w-8 items-center justify-center border-2 border-border bg-card hover:bg-destructive hover:text-destructive-foreground transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header - Desktop & Mobile */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b-4 border-border bg-background px-8">
          <div className="flex items-center gap-6">
            <button onClick={() => setMobileOpen(true)} className="flex h-12 w-12 items-center justify-center border-4 border-border bg-card shadow-[3px_3px_0px_0px_var(--shadow-blue)] md:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:block"><Crumbs /></div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 border-4 border-border bg-surface px-4 py-2 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase shadow-[3px_3px_0px_0px_var(--shadow-blue)]">
              <Bell className="h-4 w-4" /> alerts_clear
            </div>
            <div className="flex items-center gap-3 border-4 border-border bg-primary px-5 py-2 shadow-[3px_3px_0px_0px_var(--shadow-blue)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-foreground">Active_Session</span>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md md:hidden" />
              <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-[60] w-[85vw] bg-card border-r-8 border-border p-8 md:hidden overflow-y-auto">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center border-4 border-border bg-foreground text-background shadow-[3px_3px_0px_0px_var(--shadow-blue)]"><Command className="h-5 w-5" /></div>
                    <span className="text-xl font-black tracking-tighter uppercase">Admin</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="flex h-11 w-11 items-center justify-center border-4 border-border bg-background shadow-[3px_3px_0px_0px_var(--shadow-blue)]"><X className="h-5 w-5" /></button>
                </div>
                <nav className="space-y-4">
                  {NAV.map((n) => {
                    const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
                    return (
                      <Link key={n.to} to={n.to}
                        className={`flex items-center justify-between border-4 border-border px-6 py-5 text-sm font-black uppercase tracking-[0.2em] transition-all ${
                          active ? "bg-primary text-primary-foreground shadow-[6px_6px_0px_0px_var(--shadow-blue)] translate-x-1 -translate-y-1" : "bg-background text-foreground"
                        }`}>
                        <div className="flex items-center gap-4">
                          <n.icon className="h-5 w-5" /> {n.label}
                        </div>
                        {active && <ArrowUpRight className="h-5 w-5" />}
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-16 pt-8 border-t-4 border-border space-y-6">
                  <Link to="/" className="flex items-center gap-4 px-2 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /> Return_To_Core</Link>
                  <button onClick={handleLogout} className="flex items-center gap-4 px-2 text-[11px] font-black uppercase tracking-[0.3em] text-destructive hover:opacity-80"><LogOut className="h-5 w-5" /> De-Authenticate</button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <motion.main key={loc.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          className="flex-1 overflow-x-hidden bg-background">
          {children}
        </motion.main>
      </div>
    </div>
  );
}

function Crumbs() {
  const loc = useLocation();
  const segments = loc.pathname.split("/").filter(Boolean);
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
      {segments.map((s, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-foreground/20">/</span>}
          <span className={i === segments.length - 1 ? "text-foreground font-black" : ""}>{s}</span>
        </span>
      ))}
    </div>
  );
}
