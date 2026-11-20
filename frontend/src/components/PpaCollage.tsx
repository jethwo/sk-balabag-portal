import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { PPA } from "@/lib/types";

/**
 * The scattered photo collage on the home page.
 *
 * Every tile is a square of a random size in a random spot, placed by percentage inside
 * a fixed-ratio box so the whole arrangement scales with the screen. The positions were
 * packed offline (no overlaps, a small gap between every pair, and the top-right and
 * bottom-right corners left clear for the text), then frozen here so the layout is the
 * same on every render. Each tile drifts slowly and grows a little when hovered.
 *
 * Which PPAs appear is chosen in the dashboard: tick "Show in the home page photo
 * gallery" on a PPA that has a cover photo.
 */
interface Spot { left: number; top: number; size: number; tint: string }

// left/top are % of the box; size is % of its width (the square's side).
// Ordered so that a short list is still spread over the whole box.
const SPOTS: Spot[] = [
  { left: 45.1, top: 74.8, size: 14.3, tint: "bg-red" },
  { left: 0.3, top: 9.0, size: 12.9, tint: "bg-blue" },
  { left: 87.9, top: 27.0, size: 11.6, tint: "bg-yellow" },
  { left: 5.5, top: 79.3, size: 11.4, tint: "bg-purple" },
  { left: 37.5, top: 0.1, size: 8.3, tint: "bg-red" },
  { left: 63.5, top: 25.9, size: 8.5, tint: "bg-blue" },
  { left: 29.9, top: 53.0, size: 14.2, tint: "bg-yellow" },
  { left: 14.2, top: 29.2, size: 13.8, tint: "bg-purple" },
  { left: 67.1, top: 51.0, size: 13.5, tint: "bg-red" },
  { left: 47.9, top: 50.8, size: 11.3, tint: "bg-blue" },
  { left: 0.3, top: 53.2, size: 12.5, tint: "bg-yellow" },
  { left: 15.4, top: 55.0, size: 13.5, tint: "bg-purple" },
  { left: 17.5, top: 7.1, size: 11.4, tint: "bg-red" },
  { left: 32.1, top: 78.3, size: 11.9, tint: "bg-blue" },
  { left: 87.5, top: 49.5, size: 12.4, tint: "bg-yellow" },
  { left: 19.0, top: 80.3, size: 11.3, tint: "bg-purple" },
  { left: 1.3, top: 34.5, size: 9.6, tint: "bg-red" },
  { left: 73.3, top: 27.8, size: 13.0, tint: "bg-blue" },
  { left: 34.5, top: 15.9, size: 14.2, tint: "bg-yellow" },
  { left: 49.5, top: 25.5, size: 13.3, tint: "bg-purple" },
];

/** Staggered drift, worked out from the tile's place in the list so it stays the same on every render. */
const drift = (i: number): CSSProperties => ({
  "--dur": `${5 + (i % 4) * 0.9}s`,
  "--delay": `${((i % 5) * 0.6).toFixed(1)}s`,
  "--lift": `${6 + (i % 3) * 4}px`,
} as CSSProperties);

function Tile({ ppa, tint, i, className, style }:
  { ppa?: PPA; tint: string; i: number; className: string; style?: CSSProperties }) {
  return (
    <Link to={ppa ? `/ppas/${ppa.id}` : "/ppas"} title={ppa?.title} className={`group ${className}`} style={style}>
      <span className="float-tile block h-full w-full" style={drift(i)}>
        <span className={`block h-full w-full overflow-hidden rounded-sm ${tint} shadow-sm transition duration-300 ease-out group-hover:scale-110 group-hover:shadow-xl`}>
          {ppa?.cover_image && (
            <img src={ppa.cover_image} alt={ppa.title} loading="lazy"
              className="h-full w-full object-cover mix-blend-multiply transition duration-300 group-hover:mix-blend-normal" />
          )}
        </span>
      </span>
    </Link>
  );
}

const Heading = ({ className }: { className: string }) => (
  <h2 className={`text-blue ${className}`}>
    Projects, Programs <span className="font-sub font-normal">&</span>
    <br />
    <span className="font-sub font-normal">Activities</span>
  </h2>
);

const ExploreButton = ({ className }: { className?: string }) => (
  <Button asChild variant="blue" className={className}>
    <Link to="/ppas">Explore <span className="text-yellow">PPAs</span></Link>
  </Button>
);

export default function PpaCollage({ ppas, blurb }: { ppas: PPA[]; blurb?: string }) {
  // With no photos yet, fill the whole arrangement with empty tinted tiles so the
  // section still reads as a gallery.
  const tiles = SPOTS.slice(0, ppas.length ? Math.min(ppas.length, SPOTS.length) : SPOTS.length);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      {/* Wide screens: the scattered squares, with the text floating over the clear corners. */}
      <div className="relative isolate hidden aspect-[553/327] md:block">
        {tiles.map((s, i) => (
          <Tile key={i} ppa={ppas[i]} tint={s.tint} i={i} className="absolute block aspect-square hover:z-10"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: `${s.size}%` }} />
        ))}
        <Heading className="pointer-events-none absolute right-0 top-0 z-20 text-right text-4xl lg:text-5xl" />
        {/* Blurb and button share one block, so they can never collide as the text rewraps. */}
        <div className="absolute bottom-0 right-0 z-20 flex w-[38%] flex-col items-end gap-3 text-right">
          {blurb && <p className="pointer-events-none text-sm">{blurb}</p>}
          <ExploreButton className="px-10 py-4 text-base" />
        </div>
      </div>

      {/* Phones: the same tiles, stacked into a simple grid. */}
      <div className="md:hidden">
        <Heading className="mb-3 text-3xl" />
        {blurb && <p className="mb-4">{blurb}</p>}
        <div className="mb-5 grid isolate grid-cols-3 gap-2">
          {tiles.map((s, i) => (
            <Tile key={i} ppa={ppas[i]} tint={s.tint} i={i} className="relative block aspect-square hover:z-10" />
          ))}
        </div>
        <ExploreButton />
      </div>
    </section>
  );
}
