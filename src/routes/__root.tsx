import React from "react";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { AppProvider, useApp } from "@/lib/mode-context";
import { CommandPalette } from "@/components/command-palette";
import { FloatingLogs } from "@/components/floating-logs";

import { RobotAssistant } from "@/components/3d/robot-assistant";
import { Toaster } from "sonner";
import { emitRobotAction, emitRobotIntent, emitRobotSequence } from "@/lib/robot-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="section-shell max-w-2xl p-8 md:p-12">
        <p className="pill-label w-fit">404 / Route Not Found</p>
        <h1 className="mt-8 font-display text-6xl font-black tracking-tight text-foreground sm:text-8xl">
          Lost Route
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
          The requested URL has no registered handler. Use the home page to get back into the portfolio.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary-foreground"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Zeyad Mohammed - Full Stack Developer" },
      {
        name: "description",
        content:
          "Portfolio of Zeyad Mohammed, full-stack developer focused on advanced UI, UX, and interactive developer experiences.",
      },
      { name: "author", content: "Zeyad Mohammed" },
      { property: "og:title", content: "Zeyad Mohammed - Full Stack Developer" },
      { property: "og:description", content: "A polished portfolio with advanced public pages and developer tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/favicon.io" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AppProvider>
      <InnerRoot />
    </AppProvider>
  );
}

function InnerRoot() {
  const { theme, isAdmin } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) return;

      switch (event.key.toLowerCase()) {
        case "d":
          navigate({ to: "/dev" });
          break;
        case "a":
          navigate({ to: isAdmin ? "/admin" : "/admin/login" });
          break;
        case "p":
          navigate({ to: "/projects" });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin, navigate]);

  React.useEffect(() => {
    const route = location.pathname;
    const routeAction = route.startsWith("/dev")
      ? "Running"
      : route.startsWith("/projects") || route.startsWith("/education")
        ? "Walking"
        : route.startsWith("/contact")
          ? "Standing"
          : "Wave";

    emitRobotSequence([routeAction, "Standing", "Idle"], 850);
    const settle = window.setTimeout(() => emitRobotIntent("standing"), 900);
    const idle = window.setTimeout(() => emitRobotIntent("idle"), 2800);
    return () => {
      window.clearTimeout(settle);
      window.clearTimeout(idle);
    };
  }, [location.pathname]);

  React.useEffect(() => {
    const onError = () => emitRobotIntent("error");
    const onRejection = () => emitRobotIntent("error");
    const onOffline = () => emitRobotIntent("offline");
    const onOnline = () => {
      emitRobotIntent("online");
      window.setTimeout(() => emitRobotIntent("idle"), 2500);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, [role='button']")) {
        emitRobotIntent("success");
      }
    };

    let lastY = window.scrollY;
    let lastAt = performance.now();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);

      const now = performance.now();
      const deltaY = Math.abs(window.scrollY - lastY);
      const deltaT = Math.max(1, now - lastAt);
      const speed = deltaY / deltaT;

      if (speed > 1.25) emitRobotAction("Running");
      else if (speed > 0.25) emitRobotAction("Walking");

      lastY = window.scrollY;
      lastAt = now;
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    window.addEventListener("click", onClick, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div className="fixed left-0 top-0 z-[110] h-[3px] w-full bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-info transition-[width] duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
      <CommandPalette />
      <FloatingLogs />

      <ErrorBoundary>
        <RobotAssistant />
      </ErrorBoundary>
      <Toaster theme={theme as "light" | "dark" | "system"} position="bottom-right" richColors closeButton />
      <Outlet />
    </>
  );
}
