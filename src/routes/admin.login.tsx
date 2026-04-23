import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/mode-context";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";
import { fetchJson } from "@/lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const { setToken } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetchJson<any>("POST", "/api/auth/login", { email, password });
      const token = res?.data?.accessToken ?? res?.token;

      if (!token) throw new Error("No token returned from server");

      setToken(token);
      toast.success("Authentication successful");
      navigate({ to: "/admin", search: {} as any });
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Access denied.");
      toast.error("Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md">
        
        {/* Logo/Icon Area */}
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border-4 border-border bg-foreground text-background shadow-[6px_6px_0px_0px_var(--color-primary)]">
            <Fingerprint className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tighter text-foreground uppercase">Console_Access</h1>
          <p className="mt-2 text-sm font-bold text-muted-foreground">Authorized personnel only beyond this point.</p>
        </div>

        {/* Login Card */}
        <div className="border-4 border-border bg-card p-10 shadow-[8px_8px_0px_0px_var(--color-foreground)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Identifier</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  <input type="text" placeholder="admin@system.local" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full border-4 border-border bg-background pl-12 pr-4 py-3.5 text-sm font-bold outline-none shadow-[3px_3px_0px_0px_var(--color-foreground)] transition-all focus:border-primary focus:shadow-[3px_3px_0px_0px_var(--color-primary)]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  <input type="password" placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full border-4 border-border bg-background pl-12 pr-4 py-3.5 text-sm font-bold outline-none shadow-[3px_3px_0px_0px_var(--color-foreground)] transition-all focus:border-primary focus:shadow-[3px_3px_0px_0px_var(--color-primary)]" />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 border-4 border-destructive/40 bg-destructive/10 px-4 py-3 text-xs font-black text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={busy}
              className="relative flex w-full items-center justify-center gap-3 overflow-hidden border-4 border-border bg-primary px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-primary-foreground shadow-[6px_6px_0px_0px_var(--color-foreground)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50">
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Establish Session <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
            <div className="h-[2px] flex-1 bg-border" />
            <span>Encrypted Node</span>
            <div className="h-[2px] flex-1 bg-border" />
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button onClick={() => navigate({ to: "/" })} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            Return to Core
          </button>
          <div className="h-3 w-[2px] bg-border" />
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
            <ShieldCheck className="h-3 w-3" /> System Sec 2.1
          </div>
        </div>
      </motion.div>
    </div>
  );
}
