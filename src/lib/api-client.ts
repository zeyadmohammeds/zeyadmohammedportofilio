import { toast } from "sonner";

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type ProjectType = "frontend" | "backend" | "fullstack" | "mobile";

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  type: ProjectType;
  stack: string[];
  metrics: Record<string, number>;
  year: number;
  url?: string;
  repo: string;
  image?: string;
  images?: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  focus?: string;
  years: string;
  notes?: string;
}

interface Envelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: unknown;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://zeyadportfolio.runasp.net";

function normalizePath(path: string): string {
  if (path.startsWith("/api/v1/")) return path;
  if (path.startsWith("/api/")) return path.replace("/api/", "/api/v1/");
  return path;
}

function mapProject(serverProject: any): Project {
  return {
    id: serverProject.id,
    name: serverProject.name,
    tagline: serverProject.tagline,
    description: serverProject.description,
    type: serverProject.type,
    stack: Array.isArray(serverProject.stack) ? serverProject.stack : [],
    metrics: {},
    year: serverProject.year,
    url: serverProject.url ?? undefined,
    repo:
      serverProject.githubUrl?.replace(/^https?:\/\//, "") ??
      `github.com/zeyadmohammeds/${serverProject.repoName ?? ""}`,
    image: serverProject.imageUrl ?? undefined,
  };
}

function mapEducation(serverEducation: any): Education {
  const start =
    typeof serverEducation.startDate === "string" ? serverEducation.startDate.slice(0, 4) : "";
  const end =
    typeof serverEducation.endDate === "string" ? serverEducation.endDate.slice(0, 4) : "";
  return {
    id: serverEducation.id,
    school: serverEducation.school,
    degree: serverEducation.degree,
    focus: serverEducation.focus ?? undefined,
    years: start && end ? `${start} — ${end}` : "",
    notes: serverEducation.notes ?? undefined,
  };
}

function transformResponse(path: string, payload: any, method: Method): any {
  const data = payload?.data ?? payload;

  if (path.includes("/projects")) {
    if (Array.isArray(data?.items)) return data.items.map(mapProject);
    if (Array.isArray(data)) return data.map(mapProject);
    if (data?.id) return mapProject(data);
  }

  if (path.includes("/education")) {
    if (Array.isArray(data)) return data.map(mapEducation);
    if (data?.id) return mapEducation(data);
  }

  if (path.endsWith("/auth/login") || path.endsWith("/auth/refresh")) {
    return {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      role: (data.role ?? "").toLowerCase(),
      expiresAtUtc: data.expiresAtUtc,
    };
  }

  if (path.endsWith("/admin/stats")) {
    return {
      projects: data?.projects ?? 0,
      education: data?.education ?? 0,
      contacts: data?.contacts ?? 0,
      uploads: data?.uploads ?? 0,
    };
  }

  if (path.endsWith("/contact") && method === "POST") {
    if (payload?.message && !Array.isArray(payload)) {
      return { message: payload.message };
    }
  }

  return data;
}

export async function fetchJson<T>(
  method: Method,
  path: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  const normalized = normalizePath(path);
  const url = `${API_BASE_URL}${normalized}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("api:log", { detail: { type: "info", message: `REQ: ${method} ${url}` } }),
      );
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text || response.statusText };
    }

    if (!response.ok) {
      const message = data?.message || `HTTP Error ${response.status}`;
      if (typeof window !== "undefined") {
        toast.error(message);
        window.dispatchEvent(
          new CustomEvent("api:log", {
            detail: { type: "error", message: `RES: ${response.status} ${message}` },
          }),
        );
      }
      const err = new Error(message) as any;
      err.status = response.status;
      err.details = data?.errors;
      throw err;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("api:log", {
          detail: { type: "success", message: `RES: ${response.status} OK` },
        }),
      );
      if (method !== "GET") {
        window.dispatchEvent(
          new CustomEvent("api:mutation", { detail: { path: normalized, method } }),
        );
      }
    }

    return transformResponse(normalized, data, method) as T;
  } catch (err) {
    if (typeof window !== "undefined" && err instanceof TypeError) {
      toast.error("Network Error: Could not reach the backend. Ensure it is running.");
      window.dispatchEvent(
        new CustomEvent("api:log", { detail: { type: "error", message: `NETWORK ERROR` } }),
      );
    }
    throw err;
  }
}

export function decodeJwt(token: string): Record<string, any> | null {
  try {
    const [, body] = token.split(".");
    const decoded = JSON.parse(atob(body));
    const roleClaim = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return {
      sub: decoded.sub,
      username: decoded.email ?? decoded.unique_name ?? decoded.name ?? "",
      role: (roleClaim ?? decoded.role ?? "").toLowerCase(),
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
}
