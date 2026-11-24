import type { ReactNode } from "react";
import { useSite } from "@/lib/api";

/** Shipped with the site so the banner is never bare; the dashboard can override it. */
const DEFAULT_PHOTO = "/hero.jpg";

/**
 * Banner at the top of every page: a photo dimmed under a purple shade so the cream
 * and yellow text stays readable. Uses the bundled photo unless a "Banner photo" is
 * uploaded in the dashboard. Pass `title` for inner pages or `text` for the home page.
 *
 * The type scales down on phones: at the desktop sizes the banner alone filled the
 * screen below the header, so nothing on the page was visible without scrolling.
 */
export default function Hero({ title, text }: { title?: ReactNode; text?: string }) {
  const { data: site } = useSite();
  const photo = site?.hero_image || DEFAULT_PHOTO;
  return (
    <section className="relative isolate overflow-hidden bg-purple text-cream">
      {/* mix-blend-luminosity keeps only the photo's light and shade, so it reads purple. */}
      <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple via-purple/60 to-purple/35" />
      <div className="hero-text relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-7 sm:gap-4 md:py-10">
        <div>
          <h1 className="text-[1.75rem] leading-tight text-yellow sm:text-4xl md:text-5xl">PONDO SANG KABATAAN:</h1>
          <p className="max-w-sm font-sub text-lg leading-tight sm:text-xl md:text-2xl">SK Balabag Transparency Portal</p>
        </div>
        {title && <div className="font-heading text-2xl font-bold leading-tight text-yellow sm:text-3xl md:text-right md:text-5xl">{title}</div>}
        {text && <p className="max-w-xs text-sm italic sm:text-base">{text}</p>}
      </div>
    </section>
  );
}
