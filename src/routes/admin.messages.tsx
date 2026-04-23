import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useApi } from "@/hooks/use-api";
import { useApp } from "@/lib/mode-context";
import { fetchJson } from "@/lib/api-client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Save,
  X,
  Reply,
  Inbox,
  User,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  processed: boolean;
}

export const Route = createFileRoute("/admin/messages")({
  head: () => ({
    meta: [{ title: "Messages — Admin Console" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminMessages,
});

function AdminMessages() {
  const { token } = useApp();
  const { data: contacts, loading, refetch } = useApi<Contact[]>("/api/contact", [], token);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "processed">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState("");

  const filtered = (contacts ?? []).filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !c.processed) ||
      (filter === "processed" && c.processed);

    return matchesSearch && matchesFilter;
  });

  async function deleteMessage(id: string) {
    if (!confirm("PURGE_MESSAGE_FOREVER?")) return;
    try {
      await fetchJson("DELETE", `/api/contact/${id}`, null, token ?? undefined);
      toast.success("Signal purged");
      refetch();
    } catch (err) {
      toast.error("Failed to delete");
    }
  }

  async function toggleProcessed(contact: Contact) {
    try {
      await fetchJson("PATCH", `/api/contact/${contact.id}`, { id: contact.id, processed: !contact.processed }, token ?? undefined);
      toast.success(contact.processed ? "Re-queued to pending" : "Protocol processed");
      refetch();
    } catch (err) {
      toast.error("Status update failure");
    }
  }

  async function saveEdit(id: string) {
    try {
      const contact = contacts?.find((c) => c.id === id);
      await fetchJson("PATCH", `/api/contact/${id}`, { id, processed: contact?.processed ?? false, message: editBuffer }, token ?? undefined);
      toast.success("Buffer updated");
      setEditingId(null);
      refetch();
    } catch (err) {
      toast.error("Save failure");
    }
  }

  function startEditing(contact: Contact) {
    setEditingId(contact.id);
    setEditBuffer(contact.message);
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-8 py-16">
        {/* Header */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between mb-16">
          <div className="space-y-4">
            <span className="bg-primary px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary-foreground shadow-[3px_3px_0px_0px_var(--shadow-blue)]">// signal_buffer</span>
            <h1 className="text-6xl font-black tracking-tighter text-foreground leading-none uppercase">Inbox.</h1>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Managing inbound telemetry and collaboration signals.</p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="text" placeholder="SCAN_SIGNAL_IDS..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full border-4 border-border bg-card pl-14 pr-6 py-4 text-xs font-black outline-none focus:border-primary transition-all shadow-[4px_4px_0px_0px_var(--shadow-blue)] uppercase" />
            </div>
            <div className="flex flex-wrap gap-3">
              {(["all", "pending", "processed"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`border-4 border-border px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === f ? "bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_var(--shadow-blue)] translate-x-1 -translate-y-1" : "bg-card text-foreground hover:bg-primary/5"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message List */}
        <div className="space-y-8">
          {loading ? (
            Array(4).fill(null).map((_, i) => <div key={i} className="h-32 w-full animate-pulse bg-muted/20 border-4 border-border" />)
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center border-4 border-dashed border-border bg-surface py-32 text-center shadow-[10px_10px_0px_0px_var(--shadow-blue)]">
              <Inbox className="h-20 w-20 text-muted-foreground/10 mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">// Buffer_Empty</h3>
              <p className="mt-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">No signals found matching current filters.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filtered.map((c) => (
                <motion.div layout key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className={`group relative overflow-hidden border-4 transition-all ${
                    expandedId === c.id ? "border-primary bg-primary/5 shadow-[8px_8px_0px_0px_var(--shadow-blue)]" : "border-border bg-card hover:shadow-[8px_8px_0px_0px_var(--shadow-blue)]"
                  }`}>
                  <div onClick={() => setExpandedId(expandedId === c.id ? null : c.id)} className="flex cursor-pointer flex-col p-8 sm:flex-row sm:items-center sm:gap-10">
                    <div className="flex flex-1 items-center gap-8 min-w-0">
                      <div className={`flex h-16 w-16 shrink-0 items-center justify-center border-4 border-border font-black text-2xl transition-all shadow-[4px_4px_0px_0px_var(--shadow-blue)] ${
                        c.processed ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"
                      }`}>
                        {c.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="truncate text-2xl font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tighter">{c.name}</h3>
                          {!c.processed && <div className="h-3 w-3 rounded-full bg-warning animate-pulse border-2 border-border" />}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          <span className="flex items-center gap-2 border-b-2 border-border/10">{c.email}</span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span className="bg-surface px-2 py-1 border border-border">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-4 sm:mt-0">
                      <button onClick={(e) => { e.stopPropagation(); toggleProcessed(c); }}
                        className={`flex h-12 items-center gap-3 border-4 border-border px-6 text-[10px] font-black uppercase tracking-widest transition-all ${
                          c.processed ? "bg-success text-success-foreground" : "bg-surface text-muted-foreground hover:bg-success hover:text-success-foreground"
                        }`}>
                        <CheckCircle2 className="h-5 w-5" /> {c.processed ? "Processed" : "Pending"}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteMessage(c.id); }}
                        className="flex h-12 w-12 items-center justify-center border-4 border-border bg-card text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === c.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t-4 border-border bg-background">
                        <div className="p-10">
                          <div className="flex items-center justify-between mb-10">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                              <div className="h-2 w-10 bg-primary" /> Signal_Content
                            </h4>
                            <div className="flex gap-4">
                              {editingId === c.id ? (
                                <>
                                  <button onClick={() => saveEdit(c.id)} className="flex items-center gap-3 border-4 border-border bg-success px-6 py-3 text-[10px] font-black uppercase tracking-widest text-success-foreground shadow-[4px_4px_0px_0px_var(--shadow-blue)] active:translate-y-1 active:shadow-none transition-all">
                                    <Save className="h-4 w-4" /> Save_Buffer
                                  </button>
                                  <button onClick={() => setEditingId(null)} className="flex items-center gap-3 border-4 border-border bg-card px-6 py-3 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-surface transition-all">
                                    <X className="h-4 w-4" /> Discard
                                  </button>
                                </>
                              ) : (
                                <button onClick={() => startEditing(c)} className="flex items-center gap-3 border-4 border-border bg-surface px-6 py-3 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                                  <Edit3 className="h-4 w-4" /> Edit_Payload
                                </button>
                              )}
                            </div>
                          </div>

                          {editingId === c.id ? (
                            <textarea value={editBuffer} onChange={(e) => setEditBuffer(e.target.value)} rows={8}
                              className="w-full border-4 border-border bg-card p-10 text-base font-bold text-foreground outline-none focus:border-primary transition-all shadow-[6px_6px_0px_0px_var(--shadow-blue)]" />
                          ) : (
                            <div className="border-4 border-border bg-surface p-10 shadow-[6px_6px_0px_0px_var(--shadow-blue)]">
                              <p className="text-lg font-bold leading-relaxed text-foreground whitespace-pre-wrap uppercase tracking-tighter">{c.message}</p>
                            </div>
                          )}

                          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
                            <a href={`mailto:${c.email}?subject=Re: Inquiry from ${c.name}`}
                              className="inline-flex items-center justify-center gap-4 border-4 border-border bg-foreground px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-background shadow-[6px_6px_0px_0px_var(--color-primary)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-primary)] active:translate-y-0 active:shadow-none">
                              <Reply className="h-5 w-5" /> Execute_Response
                            </a>
                            <div className="flex-1" />
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] bg-border/5 px-4 py-2 border border-border/10">ID: {c.id}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
