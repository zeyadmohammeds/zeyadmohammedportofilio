import { SiteHeader, SiteFooter } from "./site-chrome";
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hero-wash absolute inset-0 opacity-10" />
        <div className="dot-grid absolute inset-0 opacity-[0.2]" />
        <div className="grain absolute inset-0 opacity-[0.03]" />
        
        {/* Layered gradients for depth */}
        <div className="absolute -left-[10%] top-24 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -right-[10%] bottom-20 h-[600px] w-[600px] rounded-full bg-secondary/5 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-background blur-[160px]" />
      </div>
      <SiteHeader />
      <main className="flex-1 pt-24 md:pt-28">{children}</main>
      <SiteFooter />
    </div>
  );
}
