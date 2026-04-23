import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useApi } from "@/hooks/use-api";
import { useApp } from "@/lib/mode-context";
import { fetchJson, type Education } from "@/lib/api-client";
import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Trash2,
  Pencil,
  Loader2,
  AlertTriangle,
  Check,
  GraduationCap,
  Calendar,
  BookOpen,
  MapPin,
  Eye,
  Award,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/education")({
  head: () => ({
    meta: [
      { title: "Education — Admin Console" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EducationAdmin,
});

interface DraftEdu {
  id?: string;
  school: string;
  degree: string;
  focus: string;
  years: string;
  notes: string;
}

function emptyDraft(): DraftEdu {
  return { school: "", degree: "", focus: "", years: "", notes: "" };
}

function eduToDraft(e: Education): DraftEdu {
  return {
    id: e.id,
    school: e.school,
    degree: e.degree,
    focus: e.focus ?? "",
    years: e.years,
    notes: e.notes ?? "",
  };
}

function EducationAdmin() {
  const { token } = useApp();
  const { data, loading, refetch } = useApi<Education[]>("/api/education", [], token);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Education | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  function openNew() { setEditing(null); setDrawerOpen(true); }
  function openEdit(e: Education) { setEditing(e); setDrawerOpen(true); }

  async function handleDelete(e: Education) {
    setBusy(e.id);
    try {
      await fetchJson("DELETE", `/api/admin/education/${e.id}`, undefined, token ?? undefined);
      toast.success("Entry removed");
      refetch();
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete");
    } finally {
      setBusy(null);
    }
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-8 py-16">
        {/* Header */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between mb-16">
          <div className="space-y-4">
            <span className="bg-primary px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary-foreground shadow-[3px_3px_0px_0px_var(--shadow-blue)]">// academic_records</span>
            <h1 className="text-6xl font-black tracking-tighter text-foreground leading-none uppercase">Education.</h1>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Documenting the growth of the architectural core.</p>
          </div>
          <button onClick={openNew}
            className="flex items-center justify-center gap-3 border-4 border-border bg-foreground px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-background shadow-[6px_6px_0px_0px_var(--color-primary)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-primary)] active:translate-y-0 active:shadow-none">
            <Plus className="h-5 w-5" /> New_Registry
          </button>
        </div>

        {/* List View */}
        <div className="border-4 border-border bg-card shadow-[10px_10px_0px_0px_var(--shadow-blue)] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 border-b-4 border-border bg-surface px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <div className="col-span-6 lg:col-span-5 text-foreground">Registry_Entry</div>
            <div className="col-span-3 lg:col-span-4 text-center">Focus_Area</div>
            <div className="col-span-2 lg:col-span-2">Timeline</div>
            <div className="col-span-1 text-right">Ops</div>
          </div>

          <div className="divide-y-4 divide-border">
            {loading ? (
              Array(3).fill(null).map((_, i) => <div key={i} className="p-12 animate-pulse bg-muted/20" />)
            ) : (data ?? []).length === 0 ? (
              <div className="py-32 text-center">
                <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground/10 mb-6" />
                <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/40">// Registry empty</p>
              </div>
            ) : (
              (data ?? []).map((e) => (
                <div key={e.id} className="grid grid-cols-12 items-center gap-4 px-8 py-8 transition-colors hover:bg-primary/5 group">
                  <div className="col-span-6 lg:col-span-5 flex items-center gap-6 min-w-0">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center border-4 border-border bg-background text-foreground shadow-[4px_4px_0px_0px_var(--shadow-blue)] group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl font-black text-foreground group-hover:text-primary transition-colors truncate uppercase tracking-tighter">{e.degree}</div>
                      <div className="mt-1 text-[10px] font-black text-muted-foreground/60 truncate uppercase tracking-[0.1em]">{e.school}</div>
                    </div>
                  </div>
                  <div className="col-span-3 lg:col-span-4 flex justify-center">
                    {e.focus ? (
                      <span className="border-2 border-border bg-info/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-info">
                        {e.focus}
                      </span>
                    ) : (
                      <span className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.3em]">CORE_SYSTEMS</span>
                    )}
                  </div>
                  <div className="col-span-2 lg:col-span-2">
                    <div className="inline-flex items-center gap-2 border-2 border-border bg-surface px-3 py-1.5 text-[10px] font-black text-muted-foreground uppercase">
                      <Calendar className="h-4 w-4 text-primary" /> {e.years}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(e)} className="flex h-12 w-12 items-center justify-center border-4 border-border bg-card hover:bg-primary hover:text-primary-foreground hover:shadow-[3px_3px_0px_0px_var(--shadow-blue)] transition-all">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button onClick={() => setConfirmDelete(e)} className="flex h-12 w-12 items-center justify-center border-4 border-border bg-card hover:bg-destructive hover:text-destructive-foreground hover:shadow-[3px_3px_0px_0px_var(--shadow-blue)] transition-all">
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
          <EducationDrawer entry={editing} onClose={() => setDrawerOpen(false)} onSaved={() => { setDrawerOpen(false); refetch(); }} />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[100] grid place-items-center bg-background/90 p-6 backdrop-blur-md" onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg border-4 border-border bg-card p-12 shadow-[12px_12px_0px_0px_var(--shadow-blue)]">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center border-4 border-border bg-destructive/10 text-destructive shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <h3 className="text-center text-3xl font-black uppercase tracking-tighter">Decommission Entry?</h3>
              <p className="mt-4 text-center text-sm font-bold text-muted-foreground uppercase leading-relaxed tracking-widest">
                Removing <span className="text-foreground">{confirmDelete.degree}</span> will purge this record from the academic uplink.
              </p>
              <div className="mt-12 grid grid-cols-2 gap-6">
                <button onClick={() => setConfirmDelete(null)} className="border-4 border-border bg-surface px-6 py-4 text-xs font-black uppercase tracking-widest text-foreground hover:bg-background">Abort_Op</button>
                <button onClick={() => handleDelete(confirmDelete)} className="border-4 border-border bg-destructive px-6 py-4 text-xs font-black uppercase tracking-widest text-destructive-foreground hover:opacity-90">
                  {busy === confirmDelete.id ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Confirm_Purge"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}

function EducationDrawer({ entry, onClose, onSaved }: { entry: Education | null; onClose: () => void; onSaved: () => void }) {
  const { token } = useApp();
  const [draft, setDraft] = useState<DraftEdu>(() => (entry ? eduToDraft(entry) : emptyDraft()));
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
      const [startYear, endYear] = draft.years.split(/[—-]/).map(p => p.trim()).filter(Boolean);
      const payload = {
        id: entry?.id, school: draft.school, degree: draft.degree, focus: draft.focus,
        startDate: `${startYear || "2010"}-01-01`, endDate: `${endYear || startYear || "2010"}-12-31`, notes: draft.notes
      };
      await fetchJson("POST", "/api/admin/education", payload, token ?? undefined);
      toast.success("Academic records synchronized");
      onSaved();
    } catch (err: any) {
      if (err.details) setErrors(err.details);
      toast.error(err.message || "Failed to update record");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-md" onClick={onClose}>
      <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-6xl flex-col border-l-8 border-border bg-card shadow-pop">
        
        <div className="flex items-center justify-between border-b-4 border-border bg-surface px-10 py-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{entry ? "// update_milestone" : "// initialize_milestone"}</span>
            <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase">{entry ? "Edit_Registry" : "New_Academic_Node"}</h2>
          </div>
          <button onClick={onClose} className="flex h-12 w-12 items-center justify-center border-4 border-border bg-background hover:bg-primary/10 shadow-[3px_3px_0px_0px_var(--shadow-blue)]"><X className="h-6 w-6" /></button>
        </div>

        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Form Side */}
          <div className="lg:col-span-7 overflow-y-auto p-10 space-y-10 border-r-4 border-border no-scrollbar">
            <Field label="Academic_Institution" error={errors.school}>
              <input value={draft.school} onChange={e => setDraft(d => ({ ...d, school: e.target.value }))} className="admin-input-premium" placeholder="Institution designation..." />
            </Field>
            <Field label="Qualification_Title" error={errors.degree}>
              <input value={draft.degree} onChange={e => setDraft(d => ({ ...d, degree: e.target.value }))} className="admin-input-premium" placeholder="Degree level..." />
            </Field>
            <div className="grid grid-cols-2 gap-6">
               <Field label="Sector_Focus">
                 <input value={draft.focus} onChange={e => setDraft(d => ({ ...d, focus: e.target.value }))} className="admin-input-premium" placeholder="Specialization..." />
               </Field>
               <Field label="Operational_Period" error={errors.years}>
                 <input value={draft.years} onChange={e => setDraft(d => ({ ...d, years: e.target.value }))} className="admin-input-premium" placeholder="YYYY - YYYY" />
               </Field>
            </div>
            <Field label="Supplementary_Notes">
              <textarea value={draft.notes} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} rows={6} className="admin-input-premium py-4" placeholder="Honors, thesis, key modules..." />
            </Field>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-5 hidden lg:flex flex-col bg-surface/40 p-12 overflow-y-auto no-scrollbar">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-10 flex items-center gap-3"><Eye className="h-4 w-4" /> Visual_Registry_Preview</span>
            <div className="border-4 border-border bg-card p-10 shadow-[12px_12px_0px_0px_var(--shadow-blue)] relative overflow-hidden">
               {/* Timeline style preview line */}
               <div className="absolute left-14 top-10 h-full w-1.5 bg-border/20" />
               <div className="relative pl-14">
                 <div className="absolute -left-5 top-0 flex h-14 w-14 items-center justify-center border-4 border-border bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
                    <GraduationCap className="h-7 w-7" />
                 </div>
                 <div className="flex items-start justify-between mb-4">
                   <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter leading-none">{draft.degree || "DEGREE_TITLE"}</h3>
                   <span className="border-2 border-border bg-surface px-2 py-1 text-[9px] font-black text-muted-foreground uppercase">{draft.years || "YYYY-YYYY"}</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs font-black text-muted-foreground uppercase tracking-widest mb-6">
                   <BookOpen className="h-4 w-4 text-primary" /> {draft.school || "INSTITUTION_NAME"}
                 </div>
                 {draft.focus && (
                   <div className="inline-flex items-center gap-3 border-2 border-border bg-info/5 px-4 py-2 text-[10px] font-black text-info mb-6 uppercase tracking-widest">
                     <Award className="h-4 w-4" /> {draft.focus}
                   </div>
                 )}
                 {draft.notes && <p className="text-xs font-bold leading-relaxed text-muted-foreground uppercase tracking-wider border-t-4 border-border pt-6">{draft.notes}</p>}
               </div>
            </div>
            
            <div className="mt-auto pt-10">
              <div className="p-6 border-4 border-border bg-background flex items-center gap-4 shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
                <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Sync_Engine_Ready</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-4 border-border px-10 py-8 flex items-center justify-between bg-surface">
           <button onClick={onClose} className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">Abort_Draft</button>
           <button onClick={onSubmit} disabled={saving} className="flex items-center justify-center gap-3 border-4 border-border bg-foreground px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-background shadow-[6px_6px_0px_0px_var(--color-primary)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-primary)] active:translate-y-0 active:shadow-none">
             {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> Push_To_Registry</>}
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
