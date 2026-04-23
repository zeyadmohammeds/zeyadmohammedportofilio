import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useApi } from "@/hooks/use-api";
import { useApp } from "@/lib/mode-context";
import { fetchJson, type Project, type ProjectType } from "@/lib/api-client";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  X,
  Trash2,
  Pencil,
  ImageIcon,
  ExternalLink,
  Github,
  Eye,
  Loader2,
  AlertTriangle,
  Check,
  LayoutGrid,
  Filter,
  ArrowRight,
  Sparkles,
  Link as LinkIcon,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({
    meta: [{ title: "Projects — Admin Console" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: ProjectsAdmin,
});

const TYPES: ProjectType[] = ["frontend", "backend", "fullstack", "mobile"];
const GITHUB_PREFIX = "https://github.com/zeyadmohammeds/";

interface DraftProject {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  type: ProjectType;
  stack: string[];
  year: number;
  githubHandle: string;
  liveUrl: string;
  image?: string;
}

function emptyDraft(): DraftProject {
  return { name: "", tagline: "", description: "", type: "fullstack", stack: [], year: new Date().getFullYear(), githubHandle: "", liveUrl: "" };
}

function projectToDraft(p: Project): DraftProject {
  const handle = p.repo.replace(/^github\.com\/zeyadmohammeds\//i, "").replace(/^github\.com\/[^/]+\//i, "");
  return { id: p.id, name: p.name, tagline: p.tagline, description: p.description, type: p.type, stack: p.stack, year: p.year, githubHandle: handle, liveUrl: p.url ?? "", image: p.image };
}

function ProjectsAdmin() {
  const { token } = useApp();
  const { data: projects, loading, refetch } = useApi<Project[]>("/api/projects", [], token);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | ProjectType>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (projects ?? []).filter((p) => {
      const matchesType = filter === "all" || p.type === filter;
      const matchesQ = q === "" || p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.stack.some((s) => s.toLowerCase().includes(q));
      return matchesType && matchesQ;
    });
  }, [projects, query, filter]);

  function openNew() { setEditing(null); setDrawerOpen(true); }
  function openEdit(p: Project) { setEditing(p); setDrawerOpen(true); }

  async function handleDelete(p: Project) {
    setBusyId(p.id);
    try {
      await fetchJson("DELETE", `/api/admin/projects/${p.id}`, undefined, token ?? undefined);
      toast.success("Project removed");
      refetch();
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-8 py-16">
        {/* Header */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between mb-16">
          <div className="space-y-4">
            <span className="bg-primary px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary-foreground shadow-[3px_3px_0px_0px_var(--shadow-blue)]">// node_orchestration</span>
            <h1 className="text-6xl font-black tracking-tighter text-foreground leading-none uppercase">Projects.</h1>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Manage your architectural collection from the core.</p>
          </div>
          <button onClick={openNew}
            className="flex items-center justify-center gap-3 border-4 border-border bg-foreground px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-background shadow-[6px_6px_0px_0px_var(--color-primary)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-primary)] active:translate-y-0 active:shadow-none">
            <Plus className="h-5 w-5" /> Initialize_New
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-6 mb-12">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input type="text" placeholder="SCAN_WORK_ID..." value={query} onChange={(e) => setQuery(e.target.value)}
              className="w-full border-4 border-border bg-card pl-14 pr-6 py-4 text-xs font-black outline-none focus:border-primary transition-all shadow-[4px_4px_0px_0px_var(--shadow-blue)] uppercase" />
          </div>
          <div className="flex flex-wrap gap-3">
            {(["all", ...TYPES] as const).map((t) => (
              <button key={t} onClick={() => setFilter(t)}
                className={`border-4 border-border px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === t ? "bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_var(--shadow-blue)] translate-x-1 -translate-y-1" : "bg-card text-foreground hover:bg-primary/5"
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* List View */}
        <div className="border-4 border-border bg-card shadow-[10px_10px_0px_0px_var(--shadow-blue)] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 border-b-4 border-border bg-surface px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <div className="col-span-6 lg:col-span-5 text-foreground">Project_Entity</div>
            <div className="col-span-3 lg:col-span-2 text-center">Class</div>
            <div className="hidden lg:col-span-3 lg:block">Tech_Stack</div>
            <div className="col-span-3 lg:col-span-2 text-right">Operations</div>
          </div>

          <div className="divide-y-4 divide-border">
            {loading ? (
              Array(5).fill(null).map((_, i) => <div key={i} className="p-12 animate-pulse bg-muted/20" />)
            ) : filtered.length === 0 ? (
              <div className="py-32 text-center">
                <LayoutGrid className="mx-auto h-16 w-16 text-muted-foreground/10 mb-6" />
                <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/40">// No entities matching scan</p>
              </div>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="grid grid-cols-12 items-center gap-4 px-8 py-8 transition-colors hover:bg-primary/5 group">
                  <div className="col-span-6 lg:col-span-5 flex items-center gap-6 min-w-0">
                    <div className="flex h-20 w-24 shrink-0 items-center justify-center border-4 border-border bg-background overflow-hidden shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
                      {p.image ? <img src={p.image} className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" /> : <ImageIcon className="h-6 w-6 text-muted-foreground/30" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl font-black text-foreground group-hover:text-primary transition-colors truncate uppercase tracking-tighter">{p.name}</div>
                      <div className="mt-1 text-[10px] font-black text-muted-foreground/60 truncate uppercase tracking-[0.1em]">{p.tagline}</div>
                    </div>
                  </div>
                  <div className="col-span-3 lg:col-span-2 flex justify-center">
                    <span className="border-2 border-border bg-primary/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-primary">
                      {p.type}
                    </span>
                  </div>
                  <div className="hidden lg:col-span-3 lg:block px-4">
                    <div className="flex flex-wrap gap-2">
                      {p.stack.slice(0, 3).map((s) => (
                        <span key={s} className="border border-border bg-surface px-2.5 py-1 text-[9px] font-black text-muted-foreground uppercase tracking-widest">{s}</span>
                      ))}
                      {p.stack.length > 3 && <span className="text-[10px] font-black text-muted-foreground/40">+{p.stack.length - 3}</span>}
                    </div>
                  </div>
                  <div className="col-span-3 lg:col-span-2 flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(p)} className="flex h-12 w-12 items-center justify-center border-4 border-border bg-card hover:bg-primary hover:text-primary-foreground hover:shadow-[3px_3px_0px_0px_var(--shadow-blue)] transition-all">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button onClick={() => setConfirmDelete(p)} className="flex h-12 w-12 items-center justify-center border-4 border-border bg-card hover:bg-destructive hover:text-destructive-foreground hover:shadow-[3px_3px_0px_0px_var(--shadow-blue)] transition-all">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Side Panel Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <ProjectDrawer project={editing} onClose={() => setDrawerOpen(false)} onSaved={() => { setDrawerOpen(false); refetch(); }} />
        )}
      </AnimatePresence>

      {/* Modal Deletion */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[100] grid place-items-center bg-background/90 p-6 backdrop-blur-md" onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg border-4 border-border bg-card p-12 shadow-[12px_12px_0px_0px_var(--shadow-blue)]">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center border-4 border-border bg-destructive/10 text-destructive shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <h3 className="text-center text-3xl font-black uppercase tracking-tighter">Purge Node?</h3>
              <p className="mt-4 text-center text-sm font-bold text-muted-foreground uppercase leading-relaxed tracking-widest">
                Deleting <span className="text-foreground">{confirmDelete.name}</span> is irreversible. All associated telemetry will be lost.
              </p>
              <div className="mt-12 grid grid-cols-2 gap-6">
                <button onClick={() => setConfirmDelete(null)} className="border-4 border-border bg-surface px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground hover:bg-background">Cancel_Op</button>
                <button onClick={() => handleDelete(confirmDelete)} className="border-4 border-border bg-destructive px-6 py-4 text-xs font-black uppercase tracking-widest text-destructive-foreground hover:opacity-90">
                  {busyId === confirmDelete.id ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Confirm_Purge"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}

function ProjectDrawer({ project, onClose, onSaved }: { project: Project | null; onClose: () => void; onSaved: () => void }) {
  const { token } = useApp();
  const [draft, setDraft] = useState<DraftProject>(() => project ? projectToDraft(project) : emptyDraft());
  const [stackInput, setStackInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        id: project?.id, name: draft.name, tagline: draft.tagline, description: draft.description, type: draft.type, stack: draft.stack, year: Number(draft.year),
        url: draft.liveUrl, repoName: draft.githubHandle, metricsJson: "{}", imageUrl: draft.image
      };
      await fetchJson("POST", "/api/admin/projects", payload, token ?? undefined);
      toast.success(project ? "Changes applied" : "Project initialized");
      onSaved();
    } catch (err: any) {
      if (err.details) setErrors(err.details);
      toast.error(err.message || "Failed to sync");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-md" onClick={onClose}>
      <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-6xl flex-col border-l-8 border-border bg-card shadow-pop">
        
        <div className="flex items-center justify-between border-b-4 border-border bg-surface px-10 py-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{project ? "// update_entry" : "// initialize_entry"}</span>
            <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase">{project ? "Edit_Project" : "New_Node"}</h2>
          </div>
          <button onClick={onClose} className="flex h-12 w-12 items-center justify-center border-4 border-border bg-background hover:bg-primary/10 shadow-[3px_3px_0px_0px_var(--shadow-blue)]"><X className="h-6 w-6" /></button>
        </div>

        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Form Side */}
          <div className="lg:col-span-7 overflow-y-auto p-10 space-y-10 border-r-4 border-border no-scrollbar">
            <Field label="Identity_Name" error={errors.name}>
              <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} className="admin-input-premium" placeholder="System designation..." />
            </Field>
            <Field label="Protocol_Tagline" error={errors.tagline}>
              <input value={draft.tagline} onChange={e => setDraft(d => ({ ...d, tagline: e.target.value }))} className="admin-input-premium" placeholder="Primary objective..." />
            </Field>
            <Field label="System_Description" error={errors.description}>
              <textarea value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} rows={6} className="admin-input-premium py-4" placeholder="Deep technical brief..." />
            </Field>
            <div className="grid grid-cols-2 gap-6">
              <Field label="Classification">
                <select value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value as any }))} className="admin-input-premium">
                  {TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </Field>
              <Field label="Deployment_Year">
                <input type="number" value={draft.year} onChange={e => setDraft(d => ({ ...d, year: Number(e.target.value) }))} className="admin-input-premium" />
              </Field>
            </div>
            <Field label="Architecture_Stack" hint="ENTER_TO_COMMIT">
              <div className="flex flex-wrap gap-2 mb-4">
                {draft.stack.map(s => <span key={s} className="flex items-center gap-2 border-2 border-border bg-surface px-3 py-2 text-[10px] font-black uppercase text-foreground">
                  {s} <button onClick={() => setDraft(d => ({ ...d, stack: d.stack.filter(x => x !== s) }))}><X className="h-3 w-3" /></button>
                </span>)}
              </div>
              <input value={stackInput} onChange={e => setStackInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { setDraft(d => ({ ...d, stack: [...d.stack, stackInput] })); setStackInput(""); } }}
                className="admin-input-premium" placeholder="Commit new tech..." />
            </Field>
            <Field label="Image_Asset_URI">
               <input value={draft.image} onChange={e => setDraft(d => ({ ...d, image: e.target.value }))} className="admin-input-premium" placeholder="https://cdn.system.local/asset.png" />
            </Field>
            <div className="grid grid-cols-2 gap-6">
              <Field label="GitHub_Handle">
                <input value={draft.githubHandle} onChange={e => setDraft(d => ({ ...d, githubHandle: e.target.value }))} className="admin-input-premium" placeholder="Repo_Name" />
              </Field>
              <Field label="Live_Uplink">
                <input value={draft.liveUrl} onChange={e => setDraft(d => ({ ...d, liveUrl: e.target.value }))} className="admin-input-premium" placeholder="https://project.io" />
              </Field>
            </div>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-5 hidden lg:flex flex-col bg-surface/40 p-12 overflow-y-auto no-scrollbar">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-10 flex items-center gap-3"><Eye className="h-4 w-4" /> Real-Time_Projection</span>
            <div className="border-4 border-border bg-card p-10 shadow-[12px_12px_0px_0px_var(--shadow-blue)]">
              <div className="aspect-video border-4 border-border bg-background mb-8 overflow-hidden shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
                {draft.image ? <img src={draft.image} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center"><ImageIcon className="h-12 w-12 text-muted-foreground/10" /></div>}
              </div>
              <div className="flex items-center justify-between mb-6">
                 <span className="border-2 border-border bg-primary px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-primary-foreground">{draft.type}</span>
                 <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{draft.year}</span>
              </div>
              <h3 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">{draft.name || "UNNAMED_ENTITY"}</h3>
              <p className="mt-4 text-xs font-bold text-muted-foreground leading-relaxed uppercase tracking-widest">{draft.tagline || "Waiting for signal input..."}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {draft.stack.map(s => <span key={s} className="border-2 border-border bg-background px-3 py-1.5 text-[9px] font-black text-foreground uppercase">{s}</span>)}
              </div>
            </div>
            
            <div className="mt-auto pt-10">
              <div className="p-6 border-4 border-border bg-background flex items-center gap-4 shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
                <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Preview_Synced</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-4 border-border px-10 py-8 flex items-center justify-between bg-surface">
           <button onClick={onClose} className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">Discard_Draft</button>
           <button onClick={onSubmit} disabled={saving} className="flex items-center justify-center gap-3 border-4 border-border bg-primary px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-primary-foreground shadow-[6px_6px_0px_0px_var(--shadow-blue)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--shadow-blue)] active:translate-y-0 active:shadow-none disabled:opacity-50">
             {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> Push_To_Production</>}
           </button>
        </div>
      </motion.aside>

      <style>{`
        .admin-input-premium { 
          width: 100%; 
          border: 4px solid var(--border); 
          background: var(--background); 
          padding: 1.25rem 1.5rem; 
          font-size: 0.75rem; 
          font-weight: 900; 
          text-transform: uppercase;
          letter-spacing: 0.1em;
          outline: none; 
          transition: all 150ms; 
          box-shadow: 4px 4px 0px 0px var(--shadow-blue);
        }
        .admin-input-premium:focus { 
          border-color: var(--primary); 
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px 0px var(--shadow-blue);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
        {hint && <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[10px] font-black uppercase tracking-widest text-destructive px-1">{error}</p>}
    </div>
  );
}


