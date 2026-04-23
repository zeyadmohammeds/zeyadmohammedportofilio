import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  BrainCircuit,
  Code2,
  Layers3,
  MonitorSmartphone,
  Sparkles,
  Workflow,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { useApi } from "@/hooks/use-api";
import { useEffect, useState, useRef } from "react";

export const Route = createFileRoute("/")({ component: Index });

interface Profile {
  name: string;
  title: string;
  pitch: string;
  availability: string;
  location?: string;
}

interface Project {
  id: string;
  name: string;
  tagline: string;
  stack: string[];
  year: number;
  image?: string;
  images?: string[];
}

const featureCards = [
  {
    icon: Layers3,
    title: "Advanced Visual Systems",
    body: "Premium hierarchy, layered components, refined spacing, and better visual storytelling across the full site.",
  },
  {
    icon: Code2,
    title: "Full-Stack Product Work",
    body: "Interfaces, APIs, backend logic, and developer surfaces designed together instead of as separate pieces.",
  },
  {
    icon: Workflow,
    title: "Signature Approach Stack",
    body: "Stronger art direction, better theme handling, and intentional responsive behavior across all devices.",
  },
] as const;

const marqueeItems = [
  "Responsive layout system",
  "Premium light theme",
  "Advanced dark theme",
  "Portfolio storytelling",
  "Interactive dev pages",
  "Mobile-first polish",
  "Layered hero sections",
  "Product-grade cards",
] as const;

/* Scroll-animated section wrapper */
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

function Index() {
  const profile = useApi<Profile>("/api/about");
  const projects = useApi<Project[]>("/api/projects");

  const [loopIndex, setLoopIndex] = useState(0);
  const loopPhrases = ["resilient APIs", "pixel-tight UI", "stronger DX", "polished themes"];

  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: storyProgress } = useScroll({ target: storyRef });

  const x = useTransform(storyProgress, [0, 1], ["0%", "-85%"]);
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.96]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoopIndex((prev) => (prev + 1) % loopPhrases.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [loopPhrases.length]);

  return (
    <PageShell>
      <div className="pb-24">

        {/* ═══════════════════════════════════════════════════════ HERO */}
        <section ref={heroRef} className="responsive-shell relative pt-0">
          <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-8">
                {/* Availability pill */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <div className="pill-label w-fit text-[10px] mb-6">
                    <span className="h-2.5 w-2.5 border-2 border-border bg-success shadow-[1px_1px_0px_0px_var(--color-foreground)]" />
                    Open to junior IC roles · Egypt / Remote
                  </div>
                </motion.div>

                {/* Hero Title — clean line-by-line reveal */}
                <div className=" mb-12">
                  <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="editorial-title max-w-4xl text-foreground"
                  >
                    Full-Stack{" "}
                    <span className="inline-block ">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={loopPhrases[loopIndex]}
                          initial={{ y: "100%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: "100%", opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          style={{ textShadow: "3px 3px 0px var(--foreground)" }}
                          className="text-primary inline-block border-b-4 border-foreground"
                        >
                          {loopPhrases[loopIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </span>{" "}
                    Engineer.
                  </motion.h1>
                </div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="editorial-subtitle max-w-xl "
                >
                  I design and ship resilient web platforms — from Postgres schemas to pixel-tight UI. Specializing in Frontend and Backend architecture.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex flex-col gap-3 sm:flex-row sm:flex-wrap mb-16"
                >
                  <Link
                    to="/projects"
                    className="group inline-flex items-center justify-center gap-3 border-4 border-border bg-primary px-8 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-primary-foreground shadow-[5px_5px_0px_0px_var(--color-foreground)] hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--color-foreground)] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    View Projects
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/dev"
                    className="group inline-flex items-center justify-center gap-3 border-4 border-border bg-card px-8 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-foreground shadow-[5px_5px_0px_0px_var(--color-foreground)] hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--color-foreground)] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    API Console
                    <Sparkles className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform" />
                  </Link>
                </motion.div>

                {/* Compact Info Row */}
                {/* <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="flex flex-wrap gap-x-12 gap-y-6"
                >
                  {[
                    { label: "Based in", value: profile.data?.location ?? "Cairo, Egypt", live: true },
                    { label: "Role", value: "Full-Stack Engineer" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-1.5">
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                        {item.label}
                        {item.live && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                          </span>
                        )}
                      </span>
                      <span className="text-foreground">{item.value}</span>
                    </div>
                  ))}
                </motion.div> */}

                {/* Advanced "Scroll to Explore" indicator */}
                {/* <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="pt-10 hidden lg:block"
                >
                  <div className="flex items-center gap-4 group">
                    <div className="h-14 w-8 border-4 border-border relative">
                      <motion.div 
                        className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-4 bg-primary"
                        animate={{ 
                          y: [0, 20, 0],
                          opacity: [1, 0.4, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] [writing-mode:vertical-lr] rotate-180">Explore Node</span>
                  </div>
                </motion.div> */}
              </div>

              {/* Right Side Panel */}
              <motion.div
                initial={{ opacity: 0, x: 60, rotate: 2 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="border-4 border-border bg-card shadow-[12px_12px_0px_0px_var(--color-foreground)] p-1 sm:p-2">
                  <div className="overflow-hidden bg-background p-4 sm:p-6 md:p-8">
                    <div className="grid gap-6">
                      <div className="border-4 border-border bg-primary px-6 py-8 sm:px-8 sm:py-10 shadow-[6px_6px_0px_0px_var(--color-foreground)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                          <BadgeCheck className="h-24 w-24" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase tracking-[0.26em] text-primary-foreground/70">
                              Experience Snapshot
                            </span>
                            <BadgeCheck className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div className="mt-8 grid grid-cols-2 gap-5">
                            {[
                              { value: "15+", label: "Projects", icon: Blocks },
                              { value: "3+", label: "Years", icon: BrainCircuit },
                              { value: "React", label: "Frontend", icon: Code2 },
                              { value: ".NET", label: "Backend", icon: Workflow },
                            ].map((item) => (
                              <div key={item.label} className="group relative flex flex-col justify-center items-center text-center border-2 border-border bg-card p-6 shadow-[3px_3px_0px_0px_var(--shadow-blue)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--shadow-blue)] transition-all min-h-[140px]">
                                <item.icon className="absolute top-3 right-3 h-3 w-3 text-primary/30 group-hover:text-primary transition-colors" />
                                <div className="text-3xl font-black tracking-tight">{item.value}</div>
                                <div className="mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                  {item.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="flex flex-col border-4 border-border bg-surface px-6 py-6 shadow-[4px_4px_0px_0px_var(--shadow-blue)] min-h-[180px]">
                          <div className="flex h-10 w-10 items-center justify-center border-2 border-border bg-primary text-primary-foreground mb-4 shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                            <Layers3 className="h-5 w-5" />
                          </div>
                          <div className="font-display text-lg font-black uppercase tracking-tight">Advanced Visual Systems</div>
                          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground font-bold uppercase tracking-wide flex-1">
                            Premium hierarchy, layered components, refined spacing, and better visual storytelling.
                          </p>
                        </div>
                        <div className="flex flex-col border-4 border-border bg-foreground text-background px-6 py-6 shadow-[4px_4px_0px_0px_var(--color-primary)] min-h-[180px]">
                          <div className="flex h-10 w-10 items-center justify-center border-2 border-background/30 bg-background/10 text-background mb-4">
                            <Code2 className="h-5 w-5" />
                          </div>
                          <div className="font-display text-lg font-black uppercase tracking-tight">Full-Stack Product Work</div>
                          <p className="mt-3 text-[11px] leading-relaxed text-background/70 font-bold uppercase tracking-wide flex-1">
                            Interfaces, APIs, backend logic, and developer surfaces designed together.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════ MARQUEE */}
        <ScrollReveal className="mt-40 overflow-hidden">
          <div className="border-y-4 border-border bg-primary/10 py-6">
            <div className="marquee-row">
              {[...marqueeItems, ...marqueeItems].map((item, index) => (
                <div key={`${item}-${index}`} className="marquee-chip">
                  <span className="h-2 w-2 border border-border bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════ STORYTELLING HORIZONTAL (STICKY) */}
        <section ref={storyRef} className="relative h-[400vh] border-y-4 border-border bg-surface-2">
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/10" />
            
            <motion.div style={{ x }} className="flex gap-12 px-[10vw]">
              {/* Intro Card */}
              <div className="flex-shrink-0 w-[80vw] md:w-[600px] flex flex-col justify-center">
                <p className="editorial-kicker mb-4">Portfolio Storytelling</p>
                <h2 className="editorial-title text-foreground leading-[1.1]">Designed as a <span style={{ textShadow: "3px 3px 0px var(--foreground)" }} className="text-primary border-b-4 border-foreground">Unified System.</span></h2>
                <div className="mt-12 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 border-2 border-border animate-pulse" />
                    <span>Scroll to explore architecture</span>
                  </div>
                </div>
              </div>

              {[
                { title: "Pixel-Tight UI", body: "Building systems that don't just work, but last. From DB migrations to UI states.", color: "bg-card" },
                { title: "Advanced DX", body: "Premium developer experiences for internal tools and public APIs.", color: "bg-foreground text-background shadow-[8px_8px_0px_0px_var(--shadow-blue)]" },
                { title: "Visual Precision", body: "Every pixel serves a purpose. Every interaction communicates intent.", color: "bg-card" },
                { title: "Product Thinking", body: "I ship products, not just features. Understanding the 'why' behind the 'what'.", color: "bg-foreground text-background shadow-[8px_8px_0px_0px_var(--shadow-blue)]" },
                { title: "Modern Tech", body: "Mastering React, .NET, and Postgres to deliver high-performance platforms.", color: "bg-surface text-foreground" },
              ].map((story, i) => (
                <div 
                  key={story.title}
                  className={`flex-shrink-0 w-[80vw] md:w-[500px] border-4 border-border p-12 shadow-[12px_12px_0px_0px_var(--shadow-blue)] self-center ${story.color}`}
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-16 flex items-center gap-3">
                    <span className="h-[2px] w-8 bg-current" />
                    Node 0{i+1}
                  </div>
                  <h3 className={`text-4xl font-black uppercase tracking-tighter mb-8 leading-none`}>{story.title}</h3>
                  <p className="text-lg font-bold leading-relaxed opacity-90">{story.body}</p>
                </div>
              ))}
              
              {/* End Card */}
              <div className="flex-shrink-0 w-[40vw] flex flex-col justify-center items-center text-center opacity-20">
                <div className="h-32 w-[2px] bg-border" />
                <span className="mt-8 text-[10px] font-black uppercase tracking-[0.5em]">End of Protocol</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ FEATURES */}
        <section className="responsive-shell pt-32 pb-16">
          <ScrollReveal className="flex flex-col items-center text-center mb-20">
            <p className="editorial-kicker mb-6">Core philosophies</p>
            <h2 className="editorial-title text-foreground">
              Built with <span style={{ textShadow: "3px 3px 0px var(--foreground)" }} className="text-primary border-b-4 border-foreground">intent.</span>
            </h2>
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-3">
            {featureCards.map((card, index) => (
              <ScrollReveal key={card.title} delay={index * 0.12}>
                <motion.div
                  whileHover={{ x: -6, y: -6 }}
                  className="border-4 border-border bg-card px-8 py-10 shadow-[6px_6px_0px_0px_var(--color-foreground)] transition-shadow hover:shadow-[12px_12px_0px_0px_var(--color-foreground)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center border-2 border-border bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_var(--color-foreground)]">
                    <card.icon className="h-7 w-7" />
                  </div>
                  <h2 className="mt-8 text-2xl font-black uppercase tracking-tighter">{card.title}</h2>
                  <p className="mt-4 text-[13px] leading-7 text-muted-foreground font-bold">{card.body}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ ARCHITECTURE + PROJECTS */}
        <section className="responsive-shell py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <ScrollReveal>
              <div className="border-4 border-border bg-card p-8 md:p-12 shadow-[8px_8px_0px_0px_var(--color-foreground)]">
                <p className="editorial-kicker">System Architecture</p>
                <h2 className="mt-6 font-display text-4xl font-black md:text-5xl uppercase tracking-tighter leading-none">
                  More advanced<br />than just<br /><span className="text-primary border-b-4 border-foreground">visuals.</span>
                </h2>
                <div className="mt-12 grid gap-6">
                  {[
                    {
                      icon: MonitorSmartphone,
                      title: "Responsive Core",
                      body: "Hero blocks stack cleanly, card radii scale on mobile, and nav/footer behavior is safe on small screens.",
                    },
                    {
                      icon: Sparkles,
                      title: "Dual-Theme Logic",
                      body: "Light and dark themes both feel intentional, with theme-aware panels, better contrast, and cleaner surfaces.",
                    },
                    {
                      icon: Blocks,
                      title: "Product Ecosystem",
                      body: "The homepage includes layered content, marquee motion, and clearer product storytelling.",
                    },
                  ].map((item, i) => (
                    <ScrollReveal key={item.title} delay={i * 0.1}>
                      <div className="group relative pl-16 py-2">
                        <div className="absolute left-0 top-3 flex h-10 w-10 items-center justify-center border-2 border-border bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)] group-hover:-translate-y-1 transition-transform">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="text-lg font-black uppercase tracking-tight">{item.title}</div>
                        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground font-bold">{item.body}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="border-4 border-border bg-card p-8 md:p-12 shadow-[8px_8px_0px_0px_var(--color-foreground)] relative overflow-hidden">
                <p className="editorial-kicker">Selected Artifacts</p>
                <h2 className="mt-6 font-display text-4xl font-black md:text-5xl uppercase tracking-tighter leading-none">
                  Recent<br />Engineering<br /><span className="text-primary border-b-4 border-foreground">Output.</span>
                </h2>
                <div className="mt-12 grid gap-6">
                  {(projects.data ?? []).slice(0, 3).map((project, i) => (
                    <ScrollReveal key={project.id} delay={i * 0.12}>
                      <motion.div
                        whileHover={{ 
                          x: -6, 
                          y: -6,
                          transition: { type: "spring", stiffness: 400, damping: 10 }
                        }}
                        className="group border-4 border-border bg-surface shadow-[4px_4px_0px_0px_var(--color-foreground)] transition-shadow hover:shadow-[10px_10px_0px_0px_var(--color-foreground)] cursor-default overflow-hidden"
                      >
                        {/* Card Image Header */}
                        {(() => {
                          const firstImage = (project.images?.[0] || project.image?.split('*')[0]?.trim());
                          if (!firstImage) return null;
                          return (
                            <div className="h-40 w-full border-b-4 border-border overflow-hidden relative">
                              <img 
                                src={firstImage} 
                                alt={project.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                              />
                            </div>
                          );
                        })()}

                        <div className="px-8 py-8">
                          <div className="flex items-center justify-between mb-6">
                            <span className="border-2 border-border bg-primary px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0px_0px_var(--color-foreground)]">
                              {project.year}
                            </span>
                            <div className="h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary animate-pulse transition-colors" />
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-primary transition-colors">{project.name}</h3>
                          <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground font-bold line-clamp-2">{project.tagline}</p>
                          <div className="mt-8 flex flex-wrap gap-2">
                            {project.stack.slice(0, 3).map((stack) => (
                              <span
                                key={stack}
                                className="border-2 border-border/40 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground"
                              >
                                {stack}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </ScrollReveal>
                  ))}
                </div>
                <Link
                  to="/projects"
                  className="group mt-12 inline-flex items-center gap-4 border-4 border-border bg-primary px-8 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-primary-foreground shadow-[5px_5px_0px_0px_var(--color-foreground)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-foreground)] active:translate-y-0 transition-all"
                >
                  Access Full Archives
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
