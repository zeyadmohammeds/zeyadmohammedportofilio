import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useApi } from "@/hooks/use-api";
import { useApp } from "@/lib/mode-context";
import { motion } from "framer-motion";
import {
  Activity,
  Users,
  FolderKanban,
  GraduationCap,
  Mail,
  Zap,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Box,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function StatCard({ icon: Icon, label, value, color, delay }: { icon: any; label: string; value: string | number; color: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay, duration: 0.5 }}
      className="group relative border-4 border-border bg-card p-6 shadow-[6px_6px_0px_0px_var(--shadow-blue)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_var(--shadow-blue)]"
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center border-4 border-border shadow-[3px_3px_0px_0px_var(--color-foreground)] ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex h-8 w-8 items-center justify-center border-2 border-border bg-surface text-success">
          <TrendingUp className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-8">
        <div className="text-5xl font-black tracking-tighter text-foreground leading-none">{value}</div>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-3">{label}</div>
      </div>
    </motion.div>
  );
}

function AdminDashboard() {
  const { user, token } = useApp();
  const projects = useApi<any[]>("/api/projects");
  const education = useApi<any[]>("/api/education");
  const messages = useApi<any[]>("/api/contact", [], token);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-8 py-16">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-primary px-4 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary-foreground shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
              Operational_Status: ACTIVE
            </span>
            <div className="h-[2px] flex-1 bg-border/20" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.85] uppercase">
            Protocol <br />
            <span className="text-primary">Online_</span>
          </h1>
          <p className="mt-8 text-sm font-bold text-muted-foreground max-w-xl leading-relaxed uppercase tracking-widest">
            Welcome back, {user?.username ?? "Zeyad"}. All system nodes are performing within optimal parameters. Telemetry data synced across 4 primary vectors.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={FolderKanban} label="Nodes_Deployed" value={projects.data?.length ?? 0} color="bg-primary text-primary-foreground" delay={0} />
          <StatCard icon={GraduationCap} label="Knowledge_Base" value={education.data?.length ?? 0} color="bg-card text-foreground" delay={0.05} />
          <StatCard icon={Mail} label="Inbound_Signals" value={messages.data?.length ?? 0} color="bg-foreground text-background" delay={0.1} />
          <StatCard icon={Activity} label="System_Efficiency" value="98%" color="bg-surface text-foreground" delay={0.15} />
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          {/* Recent Messages */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="border-4 border-border bg-card shadow-[10px_10px_0px_0px_var(--shadow-blue)] lg:col-span-8 overflow-hidden"
          >
            <div className="border-b-4 border-border bg-surface px-8 py-8 flex items-center justify-between">
              <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Signal_Buffer
              </h3>
              <Link to="/admin/messages" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:translate-x-1 transition-transform">
                Full_Archive <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y-4 divide-border">
              {messages.loading ? (
                Array(3).fill(null).map((_, i) => (
                  <div key={i} className="p-10 space-y-4">
                    <div className="h-6 w-1/3 bg-muted animate-pulse border-2 border-border" />
                    <div className="h-4 w-full bg-muted animate-pulse opacity-60 border-2 border-border" />
                  </div>
                ))
              ) : messages.data?.length === 0 ? (
                <div className="p-32 text-center font-black uppercase tracking-[0.4em] text-muted-foreground/20">
                  // BUFFER_EMPTY
                </div>
              ) : (
                messages.data?.slice(0, 5).map((m: any) => (
                  <div key={m.id} className="p-10 flex items-start gap-8 transition-all hover:bg-primary/5 group relative">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center border-4 border-border bg-background text-foreground font-black text-2xl shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
                      {m.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-black text-xl uppercase tracking-tighter truncate group-hover:text-primary transition-colors">{m.name}</div>
                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] border-2 border-border px-2 py-1 bg-surface">{new Date(m.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4">{m.email}</div>
                      <p className="text-sm font-bold text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl">{m.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="lg:col-span-4 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.25 }}
              className="border-4 border-border bg-card p-10 shadow-[10px_10px_0px_0px_var(--shadow-blue)]"
            >
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-10">Active_Protocols</h3>
              <div className="grid gap-5">
                <Link to="/admin/projects" className="group flex items-center justify-between border-4 border-border bg-foreground px-6 py-5 text-[11px] font-black uppercase tracking-[0.25em] text-background shadow-[6px_6px_0px_0px_var(--color-primary)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-primary)] active:translate-y-0 active:shadow-none">
                  <span className="flex items-center gap-4"><FolderKanban className="h-6 w-6" /> Push_Node</span>
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
                <Link to="/admin/education" className="group flex items-center justify-between border-4 border-border bg-card px-6 py-5 text-[11px] font-black uppercase tracking-[0.25em] text-foreground shadow-[6px_6px_0px_0px_var(--shadow-blue)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--shadow-blue)] active:translate-y-0 active:shadow-none">
                  <span className="flex items-center gap-4"><GraduationCap className="h-6 w-6" /> Log_Update</span>
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
                <Link to="/dev" className="group flex items-center justify-between border-4 border-border bg-surface px-6 py-5 text-[11px] font-black uppercase tracking-[0.25em] text-foreground shadow-[6px_6px_0px_0px_var(--shadow-blue)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--shadow-blue)] active:translate-y-0 active:shadow-none">
                  <span className="flex items-center gap-4"><Zap className="h-6 w-6 text-primary" /> API_Console</span>
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3 }}
              className="border-4 border-primary bg-primary/5 p-10 shadow-[10px_10px_0px_0px_var(--shadow-blue)]"
            >
              <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-8">
                <Activity className="h-6 w-6" /> Diagnostics
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                    <span>CPU_LOAD</span>
                    <span className="text-primary">24%</span>
                  </div>
                  <div className="h-3 w-full bg-border border-2 border-border">
                    <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: "24%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                    <span>MEMORY_CACHE</span>
                    <span className="text-primary">68%</span>
                  </div>
                  <div className="h-3 w-full bg-border border-2 border-border">
                    <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: "68%" }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

