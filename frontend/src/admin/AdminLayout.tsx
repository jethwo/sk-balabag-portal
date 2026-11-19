import { useQuery } from "@tanstack/react-query";
import { ExternalLink, FileText, FolderKanban, Handshake, LogOut, Settings, Target, Users } from "lucide-react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { api, clearToken, getToken } from "@/lib/api";
import { cn } from "@/lib/utils";

const nav = [
  ["ppas", "PPAs", FolderKanban], ["reports", "Reports", FileText], ["partners", "Partnerships", Handshake],
  ["officials", "Directory", Users], ["objectives", "Objectives", Target], ["site", "Site settings", Settings],
] as const;

/** Guards the admin area: no valid staff token = back to the login page. */
export default function AdminLayout() {
  const navigate = useNavigate();
  const token = getToken();
  const me = useQuery({ queryKey: ["me"], enabled: !!token, retry: false,
    queryFn: async () => (await api.get<{ username: string; is_staff: boolean }>("/auth/me/")).data });

  if (!token || me.isError || (me.data && !me.data.is_staff)) return <Navigate to="/admin/login" replace />;
  if (!me.data) return <p className="p-8">Checking access…</p>;

  async function logout() {
    try { await api.post("/auth/logout/"); } catch { /* token may already be invalid */ }
    clearToken();
    navigate("/admin/login");
  }
  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-purple p-4 text-cream md:w-60">
        <p className="mb-4 font-heading text-lg text-yellow">SK Balabag Admin</p>
        <nav className="flex flex-wrap gap-1 md:block md:space-y-1">
          {nav.map(([to, text, Icon]) => (
            <NavLink key={to} to={to} className={({ isActive }) => cn("flex items-center gap-2 rounded px-3 py-2 text-sm", isActive ? "bg-cream text-purple" : "hover:bg-white/10")}>
              <Icon size={16} /> {text}
            </NavLink>
          ))}
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-white/10"><ExternalLink size={16} /> View website</a>
          <button onClick={logout} className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-white/10"><LogOut size={16} /> Sign out ({me.data.username})</button>
        </nav>
      </aside>
      <main className="flex-1 bg-paper p-4 md:p-8"><div className="mx-auto max-w-3xl"><Outlet /></div></main>
    </div>
  );
}
