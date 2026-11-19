import type { ReactNode } from "react";
import { useSite } from "@/lib/api";

/** Purple banner at the top of every page. Pass `title` for inner pages or `text` for the home page. */
export default function Hero({ title, text }: { title?: ReactNode; text?: string }) {
  const { data: site } = useSite();
  return (
    <section className="relative bg-purple text-cream">
      {site?.hero_image && <img src={site.hero_image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />}
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10">
        <div>
          <h1 className="text-4xl text-yellow md:text-5xl">Balabag Pavia</h1>
          <p className="max-w-xs font-sub text-xl leading-tight md:text-2xl">Sangguniang Kabataan Transparency Portal</p>
        </div>
        {title && <div className="text-right font-heading text-3xl font-bold leading-tight text-yellow md:text-5xl">{title}</div>}
        {text && <p className="max-w-xs italic">{text}</p>}
      </div>
    </section>
  );
}
