import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { SystemArchitecture3D } from "@/components/3d/system-nodes";
import { ArrowRight, Database, Layers3, Lock, Network, Server, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dev/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture - Zeyad Mohammed" },
      { name: "description", content: "A visual breakdown of the frontend, backend, and data architecture." },
    ],
  }),
  component: Architecture,
});

function Architecture() {
  return (
    <PageShell>
      <div className="page-enter mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <section className="section-shell mt-4 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p className="editorial-kicker">System map</p>
              <h1 className="mt-4 font-display text-5xl font-black leading-[0.92] md:text-7xl">
                Architecture should be technical and visually legible.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
                This page explains the stack with a cleaner layout and a more advanced dashboard tone, while keeping the 3D system view.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Layers3, label: "Frontend", value: "React 19 + TanStack" },
                { icon: Server, label: "API", value: ".NET 8 + MediatR" },
                { icon: Database, label: "Data", value: "PostgreSQL + EF Core" },
                { icon: Lock, label: "Security", value: "JWT + RBAC" },
              ].map((item) => (
                <div key={item.label} className="showcase-card px-5 py-5">
                  <item.icon className="h-5 w-5 text-primary" />
                  <div className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">
                    {item.label}
                  </div>
                  <div className="mt-2 text-lg font-black">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell mt-8 overflow-hidden p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">
              <Network className="h-4 w-4" />
              Interactive topology
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">
              Drag to rotate
            </div>
          </div>
          <div className="h-[520px] overflow-hidden rounded-[1.8rem] bg-[#161412]">
            <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
              <SystemArchitecture3D />
            </Canvas>
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            {
              title: "Frontend Layer",
              body: "A router-based React app with reusable page shells, animation, and a stronger portfolio presentation system.",
            },
            {
              title: "Application Layer",
              body: "The backend exposes the portfolio content, contact flow, authentication, and developer examples through a structured API.",
            },
            {
              title: "Experience Layer",
              body: "The redesign connects both public and developer pages under one visual identity so the whole product feels intentional.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="section-shell p-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">
                <Sparkles className="h-4 w-4" />
                Insight
              </div>
              <h2 className="mt-5 font-display text-3xl font-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">
                Architecture detail
                <ArrowRight className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
