import type { ReactNode } from "react";
import { useSite } from "@/lib/api";

/** Shipped with the site so the banner is never bare; the dashboard can override it. */
const DEFAULT_PHOTO = "/hero.jpg";

/**
 * Banner at the top of every page: a photo dimmed under a purple shade so the cream
 * and yellow text stays readable. Uses the bundled photo unless a "Banner photo" is
 * uploaded in the dashboard. Pass `title` for inner pages or `text` for the home page.
 */
export default function Hero({ title, text }: { title?: ReactNode; text?: string }) {
  const { data: site } = useSite();
  const photo = site?.hero_image || DEFAULT_PHOTO;
  return (
    <section className="relative isolate overflow-hidden bg-purple text-cream">
      {/* mix-blend-luminosity keeps only the photo's light and shade, so it reads purple. */}
      <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple via-purple/60 to-purple/35" />
      <div className="hero-text relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10">
        <div>
          <h1 className="text-4xl text-yellow md:text-5xl">PONDO SANG KABATAAN:</h1>
          <p className="max-w-sm font-sub text-xl leading-tight md:text-2xl">SK Balabag Transparency Portal</p>
        </div>
        {title && <div className="text-right font-heading text-3xl font-bold leading-tight text-yellow md:text-5xl">{title}</div>}
        {text && <p className="max-w-xs italic">{text}</p>}
      </div>
    </section>
  );
}
