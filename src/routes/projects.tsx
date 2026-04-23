import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useApi } from "@/hooks/use-api";
import { AnimatePresence, motion } from "framer-motion";
import {
  AppWindow,
  ArrowRight,
  Database,
  ExternalLink,
  Layers3,
  LayoutGrid,
  Smartphone,
  X,
  Globe,
} from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects - Zeyad Mohammed" },
      {
        name: "description",
        content: "Selected projects across frontend, backend, and full-stack product work.",
      },
    ],
  }),
  component: Projects,
});

interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  type: string | number;
  stack: string[];
  metrics: Record<string, number>;
  year: number;
  repo: string;
  url?: string;
  image?: string;
  images?: string[];
}

const filters = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "fullstack", label: "Full Stack", icon: Layers3 },
  { id: "frontend", label: "Frontend", icon: AppWindow },
  { id: "backend", label: "Backend", icon: Database },
  { id: "mobile", label: "Mobile", icon: Smartphone },
] as const;

function getTypeLabel(type: string | number) {
  if (typeof type === "number") {
    return ["frontend", "backend", "fullstack", "mobile"][type] ?? "fullstack";
  }
  return type?.toString().toLowerCase() || "fullstack";
}

function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Projects() {
  const { data, loading } = useApi<Project[]>("/api/projects");
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    return data.filter((project) => getTypeLabel(project.type) === filter);
  }, [data, filter]);

  return (
    <PageShell>
      <div className="page-enter mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <section className="mt-4 overflow-hidden border-4 border-border bg-card p-6 md:p-8 shadow-[8px_8px_0px_0px_var(--color-foreground)]">
          <div className="grid gap-8">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="editorial-kicker"
              >
                Project library
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="mt-4 font-display text-5xl font-black leading-[0.92] md:text-7xl w-[100%]"
              >
                Work that balances design taste with technical execution.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground font-bold"
              >
                A curated portfolio of interfaces, backend systems, and full-stack builds. Each card is designed to feel like a product story.
              </motion.p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: `${data?.length ?? 0}+`, label: "Projects" },
                { value: "UI/UX", label: "Advanced focus" },
                { value: "Live API", label: "Real backend" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  whileHover={{ x: -3, y: -3 }}
                  className="border-4 border-border bg-surface px-5 py-5 shadow-[3px_3px_0px_0px_var(--color-foreground)] transition-shadow hover:shadow-[6px_6px_0px_0px_var(--color-foreground)]"
                >
                  <div className="text-2xl font-black">{item.value}</div>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-18 flex flex-wrap gap-3 mb-8 justify-center">
          {filters.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`inline-flex items-center gap-2 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] border-2 transition-all ${
                  active
                    ? "border-border bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_var(--color-foreground)]"
                    : "border-border/30 bg-card text-muted-foreground hover:border-border hover:shadow-[2px_2px_0px_0px_var(--color-foreground)]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </section>

        <section className="mt-8 grid gap-6 md:gap-8 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 border-4 border-border/30 bg-surface/80 animate-pulse" />
            ))}

          {!loading &&
            filtered.map((project, index) => (
              <ScrollReveal 
                key={project.id} 
                delay={(index % 3) * 0.15}
              >
                <motion.button
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ 
                    x: -8, 
                    y: -8,
                    rotate: -0.5,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full h-full text-left border-4 border-border bg-card shadow-[4px_4px_0px_0px_var(--color-foreground)] transition-shadow hover:shadow-[12px_12px_0px_0px_var(--color-foreground)] flex flex-col overflow-hidden"
                >
                  {/* Card Image Header */}
                  {(() => {
                    const firstImage = (project.images?.[0] || project.image?.split('*')[0]?.trim());
                    if (!firstImage) return null;
                    return (
                      <div className="h-48 w-full border-b-4 border-border overflow-hidden relative">
                        <div className="absolute top-3 left-3 z-10 bg-foreground text-background px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border-2 border-border shadow-[2px_2px_0px_0px_var(--color-primary)]">
                          Visual_Artifact
                        </div>
                        <img 
                          src={firstImage} 
                          alt={project.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                      </div>
                    );
                  })()}

                  <div className="relative flex-1 px-8 py-10 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className="border-2 border-border bg-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0px_0px_var(--color-foreground)]"
                      >
                        {getTypeLabel(project.type)}
                      </motion.span>
                      <span className="text-sm font-black text-muted-foreground tracking-widest">{project.year}</span>
                    </div>

                    <h2 className="font-display text-3xl font-black leading-tight uppercase tracking-tighter group-hover:text-primary transition-colors">
                      {project.name}
                    </h2>
                    
                    <p className="mt-4 text-sm leading-7 text-muted-foreground font-bold flex-1 line-clamp-2">
                      {project.tagline}
                    </p>

                    <div className="mt-10 flex flex-wrap gap-2">
                      {project.stack.slice(0, 4).map((stack) => (
                        <span
                          key={stack}
                          className="border-2 border-border/40 bg-surface/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground group-hover:border-border transition-colors"
                        >
                          {stack}
                        </span>
                      ))}
                    </div>

                    <div className="mt-10 pt-6 border-t-2 border-border/10 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary group-hover:translate-x-1 transition-transform">
                        Explore Artifact
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      <div className="h-2 w-2 rounded-full bg-border/20 group-hover:bg-primary transition-colors animate-pulse" />
                    </div>
                  </div>
                </motion.button>
              </ScrollReveal>
            ))}
        </section>

        <ScrollReveal>
          <section className="mt-8 border-4 border-border bg-card p-6 shadow-[6px_6px_0px_0px_var(--color-foreground)] md:flex md:items-center md:justify-between mt-25">
            <div>
              <p className="editorial-kicker">Developer extension</p>
              <h2 className="mt-3 font-display text-3xl font-black md:text-4xl">Want the technical side too?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground font-bold">
                The dev pages carry the same visual language, with an advanced dashboard feel for API testing and system architecture.
              </p>
            </div>
            <Link
              to="/dev"
              className="mt-5 inline-flex items-center gap-3 border-4 border-border bg-primary px-6 py-4 text-[11px] font-black uppercase tracking-[0.22em] text-primary-foreground shadow-[4px_4px_0px_0px_var(--color-foreground)] hover:-translate-y-0.5 transition-all md:mt-0"
            >
              Open Dev Pages
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-background/95 backdrop-blur-md p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 50, scale: 0.98, rotateX: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[92vh] w-full max-w-6xl overflow-hidden border-4 border-border bg-card shadow-[16px_16px_0px_0px_var(--color-foreground)] flex flex-col"
            >
              {/* Dossier Header */}
              <div className="flex items-center justify-between border-b-4 border-border bg-surface px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center border-4 border-border bg-foreground text-background shadow-[3px_3px_0px_0px_var(--color-primary)]">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Artifact_Registry</span>
                    <span className="mt-1 text-sm font-black uppercase tracking-widest">Protocol: {getTypeLabel(selectedProject.type)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-success">Deployed</span>
                    </div>
                    <div className="h-4 w-[2px] bg-border/20" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Auth: Admin_Core</span>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="group flex h-10 w-10 items-center justify-center border-2 border-border bg-background shadow-[3px_3px_0px_0px_var(--color-foreground)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  >
                    <X className="h-5 w-5 transition-transform group-hover:rotate-90" />
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Visual Gallery - Top Hero */}
                {(() => {
                  const allImages = [
                    ...(selectedProject.images ?? []),
                    ...(selectedProject.image ? selectedProject.image.split('*').map(s => s.trim()).filter(Boolean) : [])
                  ];

                  if (allImages.length === 0) return null;

                  return (
                    <div className="border-b-4 border-border bg-surface-2 p-1 relative">
                      <div className="flex gap-4 overflow-x-auto p-4 custom-scrollbar snap-x">
                        {allImages.length > 1 ? (
                          allImages.map((img, i) => (
                            <div 
                              key={i} 
                              className="flex-shrink-0 w-[85vw] md:w-[700px] border-4 border-border bg-card shadow-[8px_8px_0px_0px_var(--color-foreground)] overflow-hidden relative group snap-center"
                            >
                              <div className="absolute top-4 left-4 z-10 bg-foreground text-background px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-border">
                                Visual_Node_0{i + 1}
                              </div>
                              <img 
                                src={img} 
                                alt={`${selectedProject.name} visual ${i + 1}`}
                                className="w-full h-[300px] md:h-[450px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="w-full border-4 border-border bg-card shadow-[8px_8px_0px_0px_var(--color-foreground)] overflow-hidden relative group">
                            <div className="absolute top-4 left-4 z-10 bg-foreground text-background px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-border">
                              Featured_Artifact
                            </div>
                            <img 
                              src={allImages[0]} 
                              alt={selectedProject.name}
                              className="w-full h-[300px] md:h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                          </div>
                        )}
                      </div>
                      {/* Gallery Tip */}
                      {allImages.length > 1 && (
                        <div className="px-6 pb-4 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                          <ArrowRight className="h-3 w-3" /> Scroll for more visuals
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="p-6 md:p-12">
                  <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Left Column: Vision & Narrative */}
                    <div className="space-y-12">
                      <div>
                        <div className="inline-flex items-center gap-3 border-2 border-border bg-primary/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                          <span className="h-2 w-2 bg-primary" />
                          Project_Identity_0{selectedProject.year}
                        </div>
                        <h2 className="mt-6 font-display text-5xl font-black leading-[0.9] md:text-7xl uppercase tracking-tighter">
                          {selectedProject.name}
                        </h2>
                        <p className="mt-8 text-xl font-bold leading-relaxed text-foreground/90 uppercase tracking-tight">
                          {selectedProject.tagline}
                        </p>
                      </div>

                      <div className="border-l-8 border-primary pl-8 space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">Technical_Narrative</h4>
                        <p className="text-base leading-8 text-muted-foreground font-medium italic">
                          {selectedProject.description || "Synthesizing advanced frontend paradigms with a robust backend architecture to deliver a seamless user experience across all system nodes."}
                        </p>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="border-4 border-border bg-surface p-6 shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
                          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Architecture_Focus</div>
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 flex items-center justify-center border-2 border-border bg-foreground text-background">
                              <Database className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">Scalable_Schemas</span>
                          </div>
                        </div>
                        <div className="border-4 border-border bg-surface p-6 shadow-[4px_4px_0px_0px_var(--shadow-blue)]">
                          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">UX_Precision</div>
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 flex items-center justify-center border-2 border-border bg-primary text-primary-foreground">
                              <Smartphone className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">Mobile_First_DX</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Telemetry & Stack */}
                    <div className="space-y-10">
                      <div className="border-4 border-border bg-foreground p-8 text-background shadow-[8px_8px_0px_0px_var(--color-primary)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                          <Database className="h-32 w-32" />
                        </div>
                        <h3 className="relative z-10 text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-10 flex items-center gap-3">
                          <span className="h-2 w-6 bg-primary" /> System_Telemetry
                        </h3>
                        <div className="relative z-10 grid gap-8">
                          {Object.entries(selectedProject.metrics).map(([key, value], i) => (
                            <div key={key}>
                              <div className="flex justify-between items-end mb-3">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{key}</span>
                                <span className="text-2xl font-black tabular-nums text-primary">{value.toLocaleString()}</span>
                              </div>
                              <div className="h-2.5 w-full bg-background/10 border border-background/20 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: "75%" }} 
                                  className="h-full bg-primary" 
                                  transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-4 border-border bg-card p-8 shadow-[8px_8px_0px_0px_var(--shadow-blue)]">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-8">Engineering_Stack</h3>
                        <div className="flex flex-wrap gap-3">
                          {selectedProject.stack.map((stack, i) => (
                            <motion.span
                              key={stack}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + i * 0.05 }}
                              className="group flex items-center gap-2 border-2 border-border bg-surface px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_var(--color-foreground)]"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-primary group-hover:bg-primary-foreground" />
                              {stack}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-4">
                        {selectedProject.url && (
                          <a
                            href={selectedProject.url.startsWith('http') ? selectedProject.url : `https://${selectedProject.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-center gap-4 border-4 border-border bg-primary px-6 py-5 text-[11px] font-black uppercase tracking-[0.25em] text-primary-foreground shadow-[6px_6px_0px_0px_var(--color-foreground)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-foreground)] active:translate-y-0"
                          >
                            Access_Live_Protocol
                            <Globe className="h-4 w-4 transition-transform group-hover:rotate-12" />
                          </a>
                        )}
                        
                        {selectedProject.repo && (
                          <div className="grid gap-4 sm:grid-cols-2">
                            <a
                              href={`https://${selectedProject.repo}`}
                              target="_blank"
                              rel="noreferrer"
                              className="group flex items-center justify-center gap-4 border-4 border-border bg-foreground px-6 py-5 text-[11px] font-black uppercase tracking-[0.25em] text-background shadow-[6px_6px_0px_0px_var(--color-primary)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-primary)] active:translate-y-0"
                            >
                              Push_To_Repo
                              <ExternalLink className="h-4 w-4 transition-transform group-hover:rotate-12" />
                            </a>
                            <button
                              onClick={() => setSelectedProject(null)}
                              className="flex items-center justify-center gap-4 border-4 border-border bg-card px-6 py-5 text-[11px] font-black uppercase tracking-[0.25em] text-foreground shadow-[6px_6px_0px_0px_var(--shadow-blue)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--shadow-blue)]"
                            >
                              Archive_Exit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dossier Footer */}
              <div className="flex items-center justify-between border-t-4 border-border bg-surface px-8 py-4 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
                <span>Ref_Artifact__{selectedProject.id.slice(0, 8)}</span>
                <div className="flex gap-8">
                  <span>Loc: Core_Server_Node</span>
                  <span>Ver: 2.5.0_PROD</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
