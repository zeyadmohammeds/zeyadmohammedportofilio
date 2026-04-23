import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { fetchJson } from "@/lib/api-client";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, ArrowUpRight, Github, Linkedin, Mail, Send, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Zeyad Mohammed" },
      { name: "description", content: "Contact form with real backend validation and portfolio inquiries." },
    ],
  }),
  component: Contact,
});

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

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "ok"; msg: string }
    | { kind: "err"; msg: string }
  >({ kind: "idle" });

  async function submit(event: FormEvent) {
    event.preventDefault();
    setState({ kind: "loading" });
    try {
      const result = await fetchJson<{ message: string }>("POST", "/api/contact", { name, email, message });
      setState({ kind: "ok", msg: result.message });
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setState({ kind: "err", msg: (error as Error).message });
    }
  }

  return (
    <PageShell>
      <div className="page-enter mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <ScrollReveal>
            <div className="mt-4 border-4 border-border bg-card p-6 md:p-8 shadow-[8px_8px_0px_0px_var(--color-foreground)]">
              <p className="editorial-kicker">Contact</p>
              <h1 className="mt-4 font-display text-5xl font-black leading-[0.92] md:text-7xl">
                Let&apos;s create something with stronger UI, UX, and presence.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground font-bold">
                Use the form or contact channels below. This page talks to the real backend with full validation.
              </p>

              <div className="mt-8 grid gap-4">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "zeyad.shosha@outlook.com",
                    href: "mailto:zeyad.shosha@outlook.com",
                  },
                  {
                    icon: Github,
                    label: "GitHub",
                    value: "@zeyadmohammeds",
                    href: "https://github.com/zeyadmohammeds",
                  },
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    value: "Zeyad Mohammed",
                    href: "https://linkedin.com/in/zeyadmohammeds",
                  },
                ].map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    whileHover={{ x: -3, y: -3 }}
                    className="flex items-center justify-between border-4 border-border bg-surface px-5 py-5 shadow-[3px_3px_0px_0px_var(--color-foreground)] transition-shadow hover:shadow-[6px_6px_0px_0px_var(--color-foreground)]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center border-2 border-border bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                          {item.label}
                        </div>
                        <div className="mt-1 text-sm font-black">{item.value}</div>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </motion.a>
                ))}
              </div>

              <div className="mt-6 border-4 border-border bg-foreground px-5 py-5 text-background shadow-[4px_4px_0px_0px_var(--color-primary)]">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-background/70">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Real backend validation
                </div>
                <p className="mt-3 text-sm leading-7 text-background/80 font-bold">
                  Form submissions use the production contact endpoint, with validation and structured error handling.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <motion.form
              onSubmit={submit}
              className="mt-4 border-4 border-border bg-card p-6 md:p-8 shadow-[8px_8px_0px_0px_var(--color-foreground)]"
            >
              <div className="grid gap-5">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="w-full border-4 border-border bg-background px-5 py-4 text-sm font-bold outline-none shadow-[3px_3px_0px_0px_var(--color-foreground)] focus:shadow-[3px_3px_0px_0px_var(--color-primary)] focus:border-primary transition-all"
                    placeholder="Your name or studio"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="w-full border-4 border-border bg-background px-5 py-4 text-sm font-bold outline-none shadow-[3px_3px_0px_0px_var(--color-foreground)] focus:shadow-[3px_3px_0px_0px_var(--color-primary)] focus:border-primary transition-all"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                    Project Brief
                  </label>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={7}
                    required
                    className="w-full border-4 border-border bg-background px-5 py-4 text-sm font-bold outline-none shadow-[3px_3px_0px_0px_var(--color-foreground)] focus:shadow-[3px_3px_0px_0px_var(--color-primary)] focus:border-primary transition-all resize-y"
                    placeholder="Tell me what you want to build or improve."
                  />
                </div>

                <button
                  type="submit"
                  disabled={state.kind === "loading"}
                  className="inline-flex items-center justify-center gap-3 border-4 border-border bg-primary px-7 py-4 text-[11px] font-black uppercase tracking-[0.22em] text-primary-foreground shadow-[6px_6px_0px_0px_var(--color-foreground)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60 transition-all"
                >
                  {state.kind === "loading" ? "Sending..." : "Send Message"}
                  <Send className="h-4 w-4" />
                </button>

                <AnimatePresence mode="wait">
                  {state.kind === "ok" && (
                    <motion.div
                      key="ok"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-4 border-success/40 bg-success/10 px-5 py-4 text-sm text-success font-bold"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5" />
                        {state.msg}
                      </div>
                    </motion.div>
                  )}
                  {state.kind === "err" && (
                    <motion.div
                      key="err"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-4 border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive font-bold"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5" />
                        {state.msg}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.form>
          </ScrollReveal>
        </section>
      </div>
    </PageShell>
  );
}
