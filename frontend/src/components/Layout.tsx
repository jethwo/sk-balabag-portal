import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useSite } from "@/lib/api";
import { cn } from "@/lib/utils";

const links: [string, string, string][] = [
  ["/", "Home", ""], ["/ppas", "Projects, Programs", " & Activities"], ["/reports", "Accomplishment", " Reports"],
  ["/partners", "Partnerships", ""], ["/contact", "Contact", " Us"],
];

export default function Layout() {
  const { data: site } = useSite();
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2">
          <Link to="/" className="mr-auto flex items-center gap-2 font-heading font-bold leading-tight text-purple">
            <img src="/logo.png" alt="SK Balabag logo" className="h-10" />
            <span>Balabag Pavia<small className="block font-normal text-ink">SK Portal</small></span>
          </Link>
          <nav className="flex flex-wrap gap-x-4 text-[13px]">
            {links.map(([to, bold, light]) => (
              <NavLink key={to} to={to} end={to === "/"}
                className={({ isActive }) => cn("border-b-2 border-transparent py-1", isActive && "border-purple")}>
                <b>{bold}</b>{light}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="bg-purple text-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-10">
          <div className="space-y-1">
            <h2 className="mb-2 text-3xl text-yellow">Contact Us</h2>
            <p>{site?.address}</p>
            {site?.phone && <p>📞 {site.phone}</p>}
            {site?.email && <p>✉️ <a className="text-yellow underline" href={`mailto:${site.email}`}>{site.email}</a></p>}
            {site?.facebook && <p><a className="text-yellow underline" href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook page</a></p>}
            <p className="pt-3 text-xs">© SK Balabag, Pavia, Iloilo · <Link className="text-yellow underline" to="/admin">Admin login</Link></p>
          </div>
          <img src="/seal.png" alt="Barangay Balabag seal" className="h-20" />
        </div>
      </footer>
    </div>
  );
}
