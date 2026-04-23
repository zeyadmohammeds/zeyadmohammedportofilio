import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useApi } from "@/hooks/use-api";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Briefcase, Mail, MapPin, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - Zeyad Mohammed" },
      { name: "description", content: "Background, values, and product-focused full-stack work." },
    ],
  }),
  component: About,
});

interface Profile {
  name: string;
  title: string;
  bio: string;
  pitch: string;
  location: string;
  availability: string;
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

function About() {
  const { data } = useApi<Profile>("/api/about");

  return (
    <PageShell>
      <div className="page-enter mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <section className="mt-4 overflow-hidden p-6 md:p-8 border-4 border-border bg-card shadow-[8px_8px_0px_0px_var(--color-foreground)]">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <ScrollReveal>
              <div className="relative overflow-hidden border-4 border-border bg-foreground p-5 text-background shadow-[6px_6px_0px_0px_var(--color-primary)]">
                <div className="absolute right-4 top-4 border-2 border-background/30 bg-background/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em]">
                  About me
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-44 bg-primary" />
                <img
                  src="/me.png"
                  alt="Zeyad Mohammed portrait"
                  className="relative z-10 mx-auto mt-10 h-[28rem] w-full max-w-[20rem] object-cover object-top border-4 border-border"
                />
              </div>
            </ScrollReveal>

            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="editorial-kicker"
              >
                Profile
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-4 font-display text-5xl font-black leading-[0.93] md:text-7xl"
              >
                I build polished experiences with product thinking and engineering discipline.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground font-bold"
              >
                {data?.pitch ??
                  "I care about interfaces that feel high quality, backend logic that behaves correctly, and products that leave a strong first impression."}
              </motion.p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: MapPin, label: "Based in", value: data?.location ?? "Egypt" },
                  { icon: Briefcase, label: "Role", value: data?.title ?? "Full-Stack Developer" },
                  { icon: BadgeCheck, label: "Status", value: data?.availability ?? "Open to work" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ x: -4, y: -4 }}
                    className="border-4 border-border bg-surface px-5 py-5 shadow-[4px_4px_0px_0px_var(--color-foreground)] transition-shadow hover:shadow-[8px_8px_0px_0px_var(--color-foreground)]"
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                    <div className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="mt-2 text-sm font-black">{item.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal>
            <div className="border-4 border-border bg-card p-6 md:p-8 shadow-[6px_6px_0px_0px_var(--color-foreground)]">
              <p className="editorial-kicker">Story</p>
              <div className="mt-4 whitespace-pre-wrap text-base leading-8 text-muted-foreground font-medium">
                {data?.bio ?? "Loading profile details..."}
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-6">
            <ScrollReveal delay={0.1}>
              <div className="border-4 border-border bg-card p-6 md:p-8 shadow-[6px_6px_0px_0px_var(--color-foreground)]">
                <p className="editorial-kicker">What I care about</p>
                <div className="mt-5 grid gap-4">
                  {[
                    "Advanced UI that feels authored, not template-based.",
                    "Clear UX with stronger hierarchy, spacing, and motion.",
                    "Developer pages that are as polished as the marketing pages.",
                  ].map((item, i) => (
                    <motion.div
                      key={item}
                      whileHover={{ x: -3, y: -3 }}
                      className="border-4 border-border bg-surface px-5 py-5 shadow-[3px_3px_0px_0px_var(--color-foreground)] transition-shadow hover:shadow-[6px_6px_0px_0px_var(--color-foreground)]"
                    >
                      <Sparkles className="h-5 w-5 text-primary" />
                      <p className="mt-3 text-sm leading-7 text-muted-foreground font-bold">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="border-4 border-border bg-card p-6 md:p-8 shadow-[6px_6px_0px_0px_var(--color-foreground)]">
                <p className="editorial-kicker">Next step</p>
                <h2 className="mt-3 font-display text-3xl font-black">Want to work together?</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground font-bold">
                  I&apos;m available for portfolio redesigns, product UI work, and full-stack implementation.
                </p>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center gap-3 border-4 border-border bg-primary px-6 py-4 text-[11px] font-black uppercase tracking-[0.22em] text-primary-foreground shadow-[4px_4px_0px_0px_var(--color-foreground)] hover:-translate-y-0.5 transition-all"
                >
                  Contact Me
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="mailto:zeyad.shosha@outlook.com"
                  className="mt-3 inline-flex items-center gap-3 border-2 border-border bg-background px-6 py-4 text-[11px] font-black uppercase tracking-[0.22em] shadow-[3px_3px_0px_0px_var(--color-foreground)]"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  zeyad.shosha@outlook.com
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
