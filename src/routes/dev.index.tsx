import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { fetchJson, type Method } from "@/lib/api-client";
import { JsonView } from "@/components/json-view";
import { useApp } from "@/lib/mode-context";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  ServerCrash,
  ShieldAlert,
  Sparkles,
  TerminalSquare,
} from "lucide-react";

export const Route = createFileRoute("/dev/")({
  head: () => ({
    meta: [
      { title: "Developer Console - Zeyad Mohammed" },
      { name: "description", content: "Interactive API console with live requests and polished developer UX." },
    ],
  }),
  component: Explorer,
});

type StateKind = "success" | "validation" | "auth" | "forbidden" | "server";

interface ApiResponse {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  ms?: number;
}

interface Scenario {
  kind: StateKind;
  label: string;
  hint: string;
  build: (ctx: { token: string | null; adminToken: string | null }) => {
    method: Method;
    url: string;
    headers?: Record<string, string>;
    body?: string;
  };
}

interface EndpointCard {
  id: string;
  group: string;
  method: Method;
  path: string;
  summary: string;
  scenarios: Scenario[];
}

const json = (value: unknown) => JSON.stringify(value, null, 2);
const authHeader = (token: string | null | undefined): Record<string, string> => (token ? { Authorization: `Bearer ${token}` } : {});

const endpointCards: EndpointCard[] = [
  {
    id: "list-projects",
    group: "Public",
    method: "GET",
    path: "/api/projects",
    summary: "Fetches the public project collection for the portfolio.",
    scenarios: [
      {
        kind: "success",
        label: "List projects",
        hint: "Public route with no authentication required.",
        build: () => ({ method: "GET", url: "/api/projects" }),
      },
    ],
  },
  {
    id: "contact",
    group: "Public",
    method: "POST",
    path: "/api/contact",
    summary: "Sends a contact request with server-side validation.",
    scenarios: [
      {
        kind: "success",
        label: "Valid submission",
        hint: "Shows the happy path for the contact form.",
        build: () => ({
          method: "POST",
          url: "/api/contact",
          headers: { "content-type": "application/json" },
          body: json({
            name: "Jenny Doe",
            email: "jenny@example.com",
            message: "I want a premium portfolio redesign and advanced dev pages.",
          }),
        }),
      },
      {
        kind: "validation",
        label: "Validation error",
        hint: "Demonstrates backend field validation.",
        build: () => ({
          method: "POST",
          url: "/api/contact",
          headers: { "content-type": "application/json" },
          body: json({ name: "A", email: "bad-email", message: "short" }),
        }),
      },
    ],
  },
  {
    id: "auth",
    group: "Auth",
    method: "POST",
    path: "/api/auth/login",
    summary: "Gets a JWT token for the console and admin endpoints.",
    scenarios: [
      {
        kind: "success",
        label: "Login demo user",
        hint: "Saves a token in the current app session.",
        build: () => ({
          method: "POST",
          url: "/api/auth/login",
          headers: { "content-type": "application/json" },
          body: json({ email: "demo", password: "demo1234" }),
        }),
      },
    ],
  },
  {
    id: "admin-projects",
    group: "Admin",
    method: "GET",
    path: "/api/admin/projects",
    summary: "Tests an authenticated admin route using the stored token.",
    scenarios: [
      {
        kind: "success",
        label: "Admin access",
        hint: "Uses an admin token when available.",
        build: ({ adminToken }) => ({ method: "GET", url: "/api/admin/projects", headers: authHeader(adminToken) }),
      },
      {
        kind: "forbidden",
        label: "Missing admin role",
        hint: "Shows what happens with a missing or insufficient token.",
        build: ({ token }) => ({ method: "GET", url: "/api/admin/projects", headers: authHeader(token) }),
      },
    ],
  },
  {
    id: "boom",
    group: "Debug",
    method: "GET",
    path: "/api/debug/boom",
    summary: "Intentional error route for observing error envelopes.",
    scenarios: [
      {
        kind: "server",
        label: "Trigger server error",
        hint: "Useful for verifying error states and payload shape.",
        build: () => ({ method: "GET", url: "/api/debug/boom" }),
      },
    ],
  },
];

const kindIcon: Record<StateKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  validation: ShieldAlert,
  auth: Lock,
  forbidden: ShieldAlert,
  server: ServerCrash,
};

function Explorer() {
  const { token, setToken, user } = useApp();
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [activeEndpointId, setActiveEndpointId] = useState(endpointCards[0].id);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number | "custom">(0);
  const [responses, setResponses] = useState<Record<string, ApiResponse>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [customBody, setCustomBody] = useState("");

  const activeEndpoint = useMemo(
    () => endpointCards.find((card) => card.id === activeEndpointId) ?? endpointCards[0],
    [activeEndpointId],
  );

  // When endpoint changes, prepopulate custom body
  useMemo(() => {
    try {
      const defaultScen = activeEndpoint.scenarios.find(s => s.build({token: null, adminToken: null}).body);
      if (defaultScen) {
        setCustomBody(defaultScen.build({token: null, adminToken: null}).body || "{}");
      } else {
        setCustomBody("{\n  \n}");
      }
    } catch {
      setCustomBody("{\n  \n}");
    }
  }, [activeEndpointId]);

  async function ensureAdminToken() {
    if (adminToken) return adminToken;
    try {
      const result = await fetchJson<{ token: string }>("POST", "/api/auth/login", {
        email: "zeyad.shosha@outlook.com",
        password: "admin1234",
      });
      if (result?.token) {
        setAdminToken(result.token);
        return result.token;
      }
    } catch {
      return null;
    }
    return null;
  }

  async function trigger(scenarioIndex: number | "custom") {
    const key = `${activeEndpoint.id}:${scenarioIndex}`;
    setBusy(key);
    setActiveScenarioIdx(scenarioIndex);

    let resolvedAdminToken = adminToken;
    if (activeEndpoint.id === "admin-projects") {
      resolvedAdminToken = await ensureAdminToken();
    }

    let builtMethod = activeEndpoint.method;
    let builtUrl = activeEndpoint.path;
    let builtHeaders: Record<string, string> = { "Content-Type": "application/json" };
    let builtBody: string | undefined = undefined;

    if (scenarioIndex === "custom") {
      Object.assign(builtHeaders, authHeader(resolvedAdminToken || token));
      if (["POST", "PUT", "PATCH"].includes(activeEndpoint.method)) {
        builtBody = customBody;
      }
    } else {
      const built = activeEndpoint.scenarios[scenarioIndex].build({ token, adminToken: resolvedAdminToken });
      builtMethod = built.method;
      builtUrl = built.url;
      if (built.headers) Object.assign(builtHeaders, built.headers);
      builtBody = built.body;
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://zeyadportfolio.runasp.net";
    let urlPath = builtUrl;
    if (urlPath.startsWith("/api/") && !urlPath.startsWith("/api/v1/")) {
      urlPath = urlPath.replace("/api/", "/api/v1/");
    }

    try {
      const started = performance.now();
      const response = await fetch(`${apiBaseUrl}${urlPath}`, {
        method: builtMethod,
        headers: builtHeaders,
        body: builtBody,
      });
      const text = await response.text();
      let body: unknown = text;
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = text;
      }

      const payload = {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body,
        ms: Math.round(performance.now() - started),
      };
      setResponses((previous) => ({ ...previous, [key]: payload }));

      if (activeEndpoint.id === "auth" && response.ok) {
        const authToken = (body as { data?: { accessToken?: string }; token?: string })?.data?.accessToken
          ?? (body as { token?: string })?.token;
        if (authToken) setToken(authToken);
      }
    } catch (error) {
      setResponses((previous) => ({
        ...previous,
        [key]: { status: 0, headers: {}, body: (error as Error).message, ms: 0 },
      }));
    } finally {
      setBusy(null);
    }
  }

  const activeResponse = responses[`${activeEndpoint.id}:${activeScenarioIdx}`];

  return (
    <PageShell>
      <div className="page-enter mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <section className="mt-4 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            {/* Left Sidebar */}
            <div className="grid gap-5">
              <div className="rounded-lg border-4 border-border bg-primary px-6 py-6 shadow-[8px_8px_0px_0px_var(--color-foreground)] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_var(--color-foreground)]">
                <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-primary-foreground">
                  <TerminalSquare className="h-5 w-5" />
                  API Workspace
                </div>
                <h1 className="mt-4 font-display text-4xl font-black leading-tight text-primary-foreground md:text-5xl">
                  Postman, but <span className="underline decoration-border decoration-4">better</span>.
                </h1>
                <p className="mt-3 text-sm font-bold leading-7 text-primary-foreground/80">
                  Construct requests, test payloads, and verify real-time responses in an advanced dev interface.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-lg border-4 border-border bg-card px-5 py-5 shadow-[4px_4px_0px_0px_var(--color-foreground)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center border-2 border-border bg-secondary text-secondary-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                      <KeyRound className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Authentication
                      </div>
                      <div className="mt-1 text-sm font-black text-foreground">{user ? `${user.username} [${user.role}]` : "Unauthenticated"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-4 border-border bg-card px-4 py-4 shadow-[4px_4px_0px_0px_var(--color-foreground)]">
                <div className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground border-b-4 border-border pb-2 mb-4">
                  Endpoints Directory
                </div>
                <div className="grid gap-3">
                  {endpointCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        setActiveEndpointId(card.id);
                        setActiveScenarioIdx(0);
                      }}
                      className={`flex w-full items-center justify-between gap-3 border-2 p-3 transition-all ${
                        card.id === activeEndpointId ? "border-border bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_var(--color-foreground)] translate-x-1 -translate-y-1" : "border-border/20 bg-background text-foreground hover:border-border hover:shadow-[2px_2px_0px_0px_var(--color-foreground)]"
                      }`}
                    >
                      <div className="text-left">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{card.group}</div>
                        <div className="mt-1 text-sm font-bold">{card.path}</div>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] border-2 border-current px-2 py-1 bg-background text-foreground">{card.method}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Main Editor Area */}
            <div className="grid gap-5">
              <div className="rounded-lg border-4 border-border bg-card p-5 shadow-[8px_8px_0px_0px_var(--color-foreground)] md:p-6 transition-all">
                <div className="flex flex-col gap-6">
                  {/* Request Builder Header */}
                  <div>
                    <p className="inline-block border-2 border-border bg-primary px-2 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-primary-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                      {activeEndpoint.group}
                    </p>
                    <div className="mt-4 flex items-center border-4 border-border bg-background shadow-[4px_4px_0px_0px_var(--color-foreground)] overflow-hidden">
                      <div className="bg-secondary px-4 py-3 text-sm font-black text-secondary-foreground uppercase tracking-widest border-r-4 border-border">
                        {activeEndpoint.method}
                      </div>
                      <div className="px-4 py-3 text-lg font-bold text-foreground font-mono flex-1">
                        {activeEndpoint.path}
                      </div>
                      <button
                        onClick={() => trigger("custom")}
                        disabled={Boolean(busy)}
                        className="flex items-center gap-2 bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground border-l-4 border-border hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      >
                        {busy === `${activeEndpoint.id}:custom` ? <Loader2 className="h-5 w-5 animate-spin" /> : <Activity className="h-5 w-5" />}
                        Send
                      </button>
                    </div>
                    <p className="mt-4 text-sm font-bold text-muted-foreground">{activeEndpoint.summary}</p>
                  </div>

                  {/* Body Editor (Postman style) */}
                  {["POST", "PUT", "PATCH"].includes(activeEndpoint.method) && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between border-b-4 border-border pb-2 mb-3">
                        <h3 className="text-sm font-black uppercase tracking-widest">Request Body (JSON)</h3>
                      </div>
                      <textarea
                        value={customBody}
                        onChange={(e) => setCustomBody(e.target.value)}
                        className="w-full h-48 rounded-none border-4 border-border bg-background p-4 font-mono text-sm shadow-[4px_4px_0px_0px_var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-y"
                        spellCheck={false}
                      />
                    </div>
                  )}

                  {/* Pre-defined Scenarios */}
                  <div className="mt-6 border-t-4 border-border pt-6">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-4">Quick Scenarios</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {activeEndpoint.scenarios.map((scenario, index) => {
                        const Icon = kindIcon[scenario.kind];
                        const key = `${activeEndpoint.id}:${index}`;
                        const isBusy = busy === key;

                        return (
                          <div key={scenario.label} className="flex flex-col justify-between border-4 border-border bg-surface p-4 shadow-[4px_4px_0px_0px_var(--color-foreground)]">
                            <div>
                              <div className="flex items-center gap-2">
                                <Icon className="h-5 w-5 text-primary" />
                                <span className="text-sm font-black">{scenario.label}</span>
                              </div>
                              <p className="mt-2 text-xs font-bold text-muted-foreground">{scenario.hint}</p>
                            </div>
                            <button
                              onClick={() => trigger(index)}
                              disabled={Boolean(busy)}
                              className="mt-4 self-start border-2 border-border bg-foreground px-4 py-2 text-[10px] font-black uppercase tracking-widest text-background hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--color-primary)] transition-all disabled:opacity-50"
                            >
                              {isBusy ? "Running..." : "Run Scenario"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Area */}
              <div className="rounded-lg border-4 border-border bg-card p-5 shadow-[8px_8px_0px_0px_var(--color-foreground)] md:p-6">
                <div className="flex items-center justify-between border-b-4 border-border pb-4">
                  <h3 className="text-xl font-black uppercase tracking-widest text-foreground">Response</h3>
                  {activeResponse && (
                    <div className="flex gap-4">
                      <div className={`border-2 border-border px-3 py-1 text-sm font-black shadow-[2px_2px_0px_0px_var(--color-foreground)] ${activeResponse.status >= 400 ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground"}`}>
                        {activeResponse.status}
                      </div>
                      <div className="border-2 border-border bg-background px-3 py-1 text-sm font-black text-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                        {activeResponse.ms}ms
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 min-h-[20rem] border-4 border-border bg-[#0a0a0a] p-4 text-sm text-white shadow-[4px_4px_0px_0px_var(--color-foreground)]">
                  {activeResponse ? (
                    <JsonView data={activeResponse.body} />
                  ) : (
                    <div className="flex h-full min-h-[20rem] items-center justify-center text-center font-bold text-white/50 uppercase tracking-widest">
                      Awaiting Request...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
