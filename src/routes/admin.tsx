import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    // Allow /admin/login through. Everything else requires an admin session.
    if (location.pathname === "/admin/login") return;
    if (typeof window === "undefined") return;
    const token = window.localStorage.getItem("portfolio-token");
    if (!token) {
      throw redirect({ to: "/admin/login", search: { redirect: location.pathname } });
    }
    // Lightweight payload check (full validation happens server-side on each call)
    try {
      const [, body] = token.split(".");
      const payload = JSON.parse(atob(body)) as {
        role?: string;
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
        exp?: number;
      };
      const expired = payload.exp ? payload.exp < Date.now() / 1000 : true;
      // The .NET JWT stores role in the long claim name; normalise to lowercase for comparison
      const rawRole =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
        payload.role ??
        "";
      const role = rawRole.toLowerCase();
      if (expired || role !== "admin") {
        window.localStorage.removeItem("portfolio-token");
        throw redirect({ to: "/admin/login", search: { redirect: location.pathname } });
      }
    } catch {
      window.localStorage.removeItem("portfolio-token");
      throw redirect({ to: "/admin/login", search: { redirect: location.pathname } });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
