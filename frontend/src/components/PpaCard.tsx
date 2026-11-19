import { Link } from "react-router-dom";
import type { PPA } from "@/lib/types";
import { fmtDate } from "@/lib/utils";

export default function PpaCard({ ppa }: { ppa: PPA }) {
  return (
    <Link to={`/ppas/${ppa.id}`} className="block overflow-hidden rounded-md border border-ink/10 bg-paper shadow-sm transition-shadow hover:shadow-md">
      {ppa.cover_image
        ? <img src={ppa.cover_image} alt="" className="h-36 w-full object-cover" />
        : <div className="grid h-36 place-items-center bg-cream text-sm text-ink/50">No photo</div>}
      <div className="p-3">
        <b className="block text-sm leading-snug">{ppa.title}</b>
        <small className="text-xs text-purple">{fmtDate(ppa.date_posted)}</small>
      </div>
    </Link>
  );
}
