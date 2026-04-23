import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useApi } from "@/hooks/use-api";
import { motion } from "framer-motion";
import { CalendarDays, GraduationCap, Medal, School } from "lucide-react";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Education - Zeyad Mohammed" },
      { name: "description", content: "Academic background and continuous learning journey." },
    ],
  }),
  component: Education,
});

interface Edu {
  id: string;
  school: string;
  degree: string;
  focus?: string;
  years: string;
  notes?: string;
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

function Education() {
  const { data, loading } = useApi<Edu[]>("/api/education");

  return (
    <PageShell>
      <div className="page-enter mx-auto max-w-6xl px-4 pb-10 md:px-8">
        <section className="mt-4 border-4 border-border bg-card p-6 md:p-8 shadow-[8px_8px_0px_0px_var(--color-foreground)]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="editorial-kicker"
          >
            Education
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-4 font-display text-5xl font-black leading-[0.92] md:text-7xl"
          >
            Learning that supports better product and engineering decisions.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground font-bold"
          >
            Academic milestones, technical focus areas, and the progression behind the work shown across this portfolio.
          </motion.p>
        </section>

        <section className="relative mt-8">
          <div className="absolute bottom-0 left-6 top-4 hidden w-1 bg-border md:block" />
          <div className="grid gap-6">
            {(loading ? Array.from({ length: 3 }).map((_, index) => ({ id: `skeleton-${index}` } as Edu)) : data ?? []).map(
              (item, index) => (
                <ScrollReveal key={item.id} delay={index * 0.08}>
                  <div className="relative md:pl-16">
                    <div className="absolute left-0 top-8 hidden h-12 w-12 items-center justify-center border-4 border-border bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_var(--color-foreground)] md:flex">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="border-4 border-border bg-card p-6 md:p-8 shadow-[6px_6px_0px_0px_var(--color-foreground)]">
                      {loading ? (
                        <div className="grid gap-4">
                          <div className="h-8 w-2/3 bg-surface border-2 border-border/20" />
                          <div className="h-5 w-1/3 bg-surface border-2 border-border/20" />
                          <div className="h-20 bg-surface border-2 border-border/20" />
                        </div>
                      ) : (
                        <div className="grid gap-6 lg:grid-cols-[1fr_0.34fr]">
                          <div>
                            <div className="inline-flex items-center gap-2 border-2 border-border bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-primary-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                              <School className="h-3.5 w-3.5" />
                              {item.school}
                            </div>
                            <h2 className="mt-5 font-display text-3xl font-black md:text-4xl">{item.degree}</h2>
                            {item.focus && (
                              <div className="mt-5 border-4 border-border bg-surface px-5 py-5 shadow-[3px_3px_0px_0px_var(--color-foreground)]">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                                  <Medal className="h-4 w-4" />
                                  Focus area
                                </div>
                                <div className="mt-3 text-lg font-black">{item.focus}</div>
                              </div>
                            )}
                            {item.notes && <p className="mt-5 text-sm leading-7 text-muted-foreground font-bold">{item.notes}</p>}
                          </div>

                          <motion.div
                            whileHover={{ x: -3, y: -3 }}
                            className="border-4 border-border bg-surface px-5 py-5 shadow-[3px_3px_0px_0px_var(--color-foreground)] transition-shadow hover:shadow-[6px_6px_0px_0px_var(--color-foreground)]"
                          >
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                              <CalendarDays className="h-4 w-4 text-primary" />
                              Timeline
                            </div>
                            <div className="mt-4 font-display text-3xl font-black">{item.years}</div>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground font-bold">
                              Formal learning paired with hands-on development across interface work and backend architecture.
                            </p>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ),
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
