import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import Hero from "@/components/Hero";
import Rich from "@/components/Rich";
import { api } from "@/lib/api";
import type { PPA } from "@/lib/types";
import { fmtDate } from "@/lib/utils";

const tag = "inline-block rounded px-3 py-1.5 font-heading text-sm font-bold";

export default function PpaDetail() {
  const { id } = useParams();
  const { data: p, isLoading, isError } = useQuery({
    queryKey: ["ppas", id], queryFn: async () => (await api.get<PPA>(`/ppas/${id}/`)).data,
  });

  return (
    <>
      <Hero title={<><b>Projects, Programs</b><br /><span className="font-sub font-normal">& Activities</span></>} />
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-8">
        <Link to="/ppas" className="text-sm text-blue underline">← All PPAs</Link>
        {isLoading && <p className="mt-4">Loading…</p>}
        {isError && <p className="mt-4">PPA not found.</p>}
        {p && (
          <article>
            <h1 className="mt-2 text-2xl text-purple sm:text-3xl md:text-4xl">{p.title}</h1>
            <small>{fmtDate(p.date_posted)}</small>
            {p.cover_image && <img src={p.cover_image} alt="" className="my-4 max-h-[280px] w-full rounded object-cover sm:max-h-[480px]" />}
            <div className="flex flex-wrap gap-2">
              <span className={`${tag} bg-yellow text-ink`}>Project Dates: {p.project_dates || "—"}</span>
              <span className={`${tag} bg-blue text-cream`}>Status: {p.status}</span>
              <span className={`${tag} bg-purple text-cream`}>Center of Participation: {p.center}</span>
              <span className={`${tag} bg-red text-cream`}>Committees in Charge: {p.committees || "—"}</span>
            </div>
            <div className="mt-4"><Rich html={p.description} /></div>
            {p.images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                {p.images.map((im) => <img key={im.id} src={im.image} alt={im.caption} className="h-28 w-full rounded object-cover sm:h-40" />)}
              </div>
            )}
          </article>
        )}
      </div>
    </>
  );
}
