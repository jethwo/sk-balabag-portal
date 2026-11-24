import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useSite } from "@/lib/api";
import { cn } from "@/lib/utils";

// to, bold part of the label, light part, and the short label phones get: the full
// wording wraps to two lines on a narrow screen, which doubles the sticky header.
const links: [string, string, string, string][] = [
  ["/", "Home", "", "Home"],
  ["/ppas", "Projects, Programs", " & Activities", "PPAs"],
  ["/reports", "Accomplishment", " Reports", "Reports"],
  ["/partners", "Partnerships", "", "Partners"],
  ["/contact", "Contact", " Us", "Contact"],
];

export default function Layout() {
  const { data: site } = useSite();
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Barangay seal on the left, SK logo on the right, both transparent PNGs on the off-white bar. */}
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2">
          <Link to="/" className="mr-auto flex items-center gap-2 font-heading text-sm font-bold leading-tight text-purple sm:text-base">
            <img src="/seal.png" alt="Barangay Balabag seal" className="h-9 md:h-11" />
            <span>SK BALABAG<small className="block font-normal text-ink">Transparency Portal</small></span>
          </Link>
          {/* On phones the nav is its own full-width row: short labels, evenly spread, and
              allowed to scroll sideways rather than wrap if a label is ever made longer. */}
          <nav className="order-last flex w-full justify-between gap-x-4 overflow-x-auto text-[13px] md:order-none md:w-auto md:justify-start">
            {links.map(([to, bold, light, short]) => (
              <NavLink key={to} to={to} end={to === "/"}
                className={({ isActive }) => cn("shrink-0 whitespace-nowrap border-b-2 border-transparent py-1.5", isActive && "border-purple")}>
                <b className="md:hidden">{short}</b>
                <span className="hidden md:inline"><b>{bold}</b>{light}</span>
              </NavLink>
            ))}
          </nav>
          <img src="/logo.png" alt="SK Balabag logo" className="h-9 md:h-11" />
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="bg-purple text-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-8 md:py-10">
          <div className="space-y-1">
            <h2 className="mb-2 text-2xl text-yellow sm:text-3xl">Contact Us</h2>
            <p>{site?.address}</p>
            {site?.phone && <p>📞 {site.phone}</p>}
            {site?.email && <p className="break-all">✉️ <a className="text-yellow underline" href={`mailto:${site.email}`}>{site.email}</a></p>}
            {site?.facebook && <p><a className="text-yellow underline" href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook page</a></p>}
            <p className="pt-3 text-xs">© SK Balabag, Pavia, Iloilo · <Link className="text-yellow underline" to="/admin">Admin login</Link></p>
          </div>
          <img src="/seal.png" alt="Barangay Balabag seal" className="h-16 sm:h-20" />
        </div>
      </footer>
    </div>
  );
}
