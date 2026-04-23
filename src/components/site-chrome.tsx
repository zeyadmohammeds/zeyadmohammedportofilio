import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/lib/mode-context";
import {
  ArrowUpRight,
  Code2,
  Github,
  Linkedin,
  Menu,
  Moon,
  Sparkles,
  Sun,
  User,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export const userNav = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/education", label: "Education" },
  { to: "/contact", label: "Contact" },
] as const;

const devNav = [
  { to: "/dev", label: "Console" },
  { to: "/dev/upload", label: "Upload Lab" },
  { to: "/dev/architecture", label: "Architecture" },
] as const;

function ModeToggle({ className = "" }: { className?: string }) {
  const { mode, toggleMode } = useApp();
  const isDev = mode === "developer";

  return (
    <button
      onClick={toggleMode}
      className={`relative h-11 w-[164px] overflow-hidden border-4 border-border bg-card px-1 shadow-[4px_4px_0px_0px_var(--color-foreground)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${className}`}
      aria-label="Toggle mode"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-primary shadow-[2px_2px_0px_0px_var(--color-foreground)]"
        style={{ left: isDev ? "calc(48% + 2px)" : "2px" }}
      />
      <div className="relative z-10 flex w-full items-center text-[10px] font-black uppercase tracking-[0.2em]">
        <div className={`flex flex-1 items-center justify-center gap-2 transition-colors duration-300 ${!isDev ? "text-primary-foreground" : "text-muted-foreground"}`}>
          <User className="h-3 w-3" />
          USER
        </div>
        <div className={`flex flex-1 items-center justify-center gap-2 transition-colors duration-300 ${isDev ? "text-primary-foreground" : "text-muted-foreground"}`}>
          <Code2 className="h-3 w-3" />
          DEV
        </div>
      </div>
    </button>
  );
}

export function SiteHeader() {
  const { mode, theme, toggleTheme, isAdmin } = useApp();
  const nav = mode === "user" ? userNav : devNav;
  const loc = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [triggering, setTriggering] = useState(false);

  // Scroll Progress
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((window.scrollY / totalHeight) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [loc.pathname]);

  useEffect(() => {
    let keys = "";
    const handler = (event: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      keys += event.key;
      if (keys.length > 5) keys = keys.slice(-5);
      if (keys.toLowerCase() === "zeyad") {
        setTriggering(true);
        window.setTimeout(() => {
          setTriggering(false);
          navigate({ to: isAdmin ? "/admin" : "/admin/login" });
        }, 1200);
        keys = "";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isAdmin, navigate]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[200] h-1.5 bg-border/20">
        <motion.div
          className="h-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>

      <AnimatePresence>
        {triggering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="border-4 border-border bg-card px-10 py-12 text-center shadow-[8px_8px_0px_0px_var(--color-foreground)]"
            >
              <div className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center border-4 border-border bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_var(--color-foreground)]">
                <Sparkles className="h-8 w-8" />
              </div>
              <p className="mt-5 font-mono text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                Unlocking admin surface
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed inset-x-0 top-0 z-[100] px-4 py-4 md:px-8">
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-7 transition-all duration-300 ${
            scrolled ? "border-4 border-border bg-card shadow-[6px_6px_0px_0px_var(--color-foreground)]" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border-4 border-border bg-foreground text-sm font-black text-background shadow-[3px_3px_0px_0px_var(--color-primary)]">
              ZM
            </div>
            <div className="min-w-0">
              <div className="truncate font-display text-base font-black leading-none md:text-lg">Zeyad Mohammed</div>
              <div className="mt-1 hidden text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground sm:block">
                Full-Stack Developer | Frontend & Backend
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = loc.pathname === item.to || (item.to !== "/" && loc.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition-all ${
                    active ? "border-2 border-border bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]" : "text-muted-foreground hover:text-foreground hover:bg-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <ModeToggle className="hidden md:flex" />
            <button
              onClick={toggleTheme}
              className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-border bg-card shadow-[3px_3px_0px_0px_var(--color-foreground)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-foreground)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.div>
              </AnimatePresence>
            </button>
            <button
              onClick={() => setMobileOpen((value) => !value)}
              className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-border bg-card lg:hidden shadow-[2px_2px_0px_0px_var(--color-foreground)]"
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[150] bg-background lg:hidden"
            >
              <div className="flex flex-col h-full pt-32 px-6">
                <div className="flex flex-col gap-3">
                  {nav.map((item, i) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between border-4 border-border p-6 text-xl font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_var(--shadow-blue)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                          loc.pathname === item.to ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
                        }`}
                      >
                        {item.label}
                        <ArrowUpRight className="h-6 w-6" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-auto pb-12 border-t-4 border-border pt-8 flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Mode Protocol</span>
                    <ModeToggle />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Appearance</span>
                    <button
                      onClick={toggleTheme}
                      className="flex h-11 px-6 items-center gap-3 border-2 border-border bg-card shadow-[3px_3px_0px_0px_var(--color-foreground)]"
                    >
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{theme} mode</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 px-4 pb-12 md:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl border-4 border-border bg-foreground text-background shadow-[12px_12px_0px_0px_var(--shadow-blue)] px-8 py-16 md:px-14 relative group">
        {/* Intentional detail: Background data stream */}
        <div className="absolute inset-0 opacity-[0.03] font-mono text-[8px] leading-none pointer-events-none select-none overflow-hidden p-4 whitespace-pre">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <span>{Math.random().toString(16)}</span>
              <span>FETCH_NODE_STATUS: OK</span>
              <span>UI_LATENCY: {Math.random().toFixed(2)}ms</span>
              <span>RENDER_ENGINE: NEO_BRUTALIST_V2</span>
            </div>
          ))}
        </div>

        <div className="grid gap-14 lg:grid-cols-[1.3fr_0.7fr_0.7fr] relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 border-2 border-background/30 bg-primary text-primary-foreground px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0px_0px_var(--color-background)]">
              <Zap className="h-4 w-4" />
              Available for work
            </div>
            <h2 className="font-display text-4xl font-black leading-[0.9] tracking-tighter md:text-6xl text-background">
              Let&apos;s build a <span className="text-primary underline decoration-primary decoration-8 underline-offset-8">product</span> experience people remember.
            </h2>
            <p className="max-w-md text-sm leading-8 text-background/70 font-bold">
              Full-Stack Developer specializing in Frontend architecture and Backend systems. Building premium, high-performance web platforms with intent.
            </p>
          </div>

          <div className="lg:pl-10">
            <div className="text-[14px] font-black border-b-4 border-primary inline-block pb-1 uppercase tracking-[0.2em] text-background">Navigation</div>
            <div className="mt-8 flex flex-col gap-4">
              {userNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex items-center justify-between text-lg font-black uppercase tracking-tight text-background/80 transition-all hover:text-primary hover:translate-x-2"
                >
                  {item.label}
                  <ArrowUpRight className="h-6 w-6 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-primary" />
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:pl-10">
            <div className="text-[14px] font-black border-b-4 border-primary inline-block pb-1 uppercase tracking-[0.2em] text-background">Connect</div>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://github.com/zeyadmohammeds"
                target="_blank"
                rel="noreferrer"
                className="flex h-16 w-16 items-center justify-center border-2 border-background/30 bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-background)] transition-all shadow-[2px_2px_0px_0px_var(--color-background)]"
              >
                <Github className="h-8 w-8" />
              </a>
              <a
                href="https://linkedin.com/in/zeyadmohammeds"
                target="_blank"
                rel="noreferrer"
                className="flex h-16 w-16 items-center justify-center border-2 border-background/30 bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-background)] transition-all shadow-[2px_2px_0px_0px_var(--color-background)]"
              >
                <Linkedin className="h-8 w-8" />
              </a>
            </div>
            <div className="mt-12 space-y-3">
              <p className="text-[12px] font-black uppercase tracking-[0.25em] text-background/80">© {year} Zeyad Mohammed</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-background/50">Designed with intent in Cairo</p>
            </div>
          </div>
        </div>
        
        {/* Corner Accents */}
        <div className="absolute top-0 right-0 p-1 opacity-20 pointer-events-none">
          <div className="w-12 h-12 border-t-4 border-r-4 border-background" />
        </div>
        <div className="absolute bottom-0 left-0 p-1 opacity-20 pointer-events-none">
          <div className="w-12 h-12 border-b-4 border-left-4 border-background" />
        </div>
      </div>
    </footer>
  );
}
