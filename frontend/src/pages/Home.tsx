import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import PpaCollage from "@/components/PpaCollage";
import { Button } from "@/components/ui/button";
import { useList, useSite } from "@/lib/api";
import type { Objective, Partner, PPA } from "@/lib/types";

export default function Home() {
  const { data: site } = useSite();
  const { data: objectives = [] } = useList<Objective>("objectives");
  const { data: ppas = [] } = useList<PPA>("ppas");
  const { data: partners = [] } = useList<Partner>("partners");
  // The collage shows the PPAs ticked as featured in the dashboard; until someone
  // ticks any, it falls back to the most recent PPAs that have a cover photo.
  const withPhoto = ppas.filter((p) => p.cover_image);
  const featured = withPhoto.filter((p) => p.is_featured);
  const gallery = featured.length ? featured : withPhoto;

  return (
    <>
      <Hero text={site?.hero_text} />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-3xl text-purple">Statement <span className="font-sub font-normal">& Objectives</span></h2>
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          {objectives.map((o, i) => (
            <div key={o.id} className="flex gap-4">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-purple font-heading text-xl text-cream">{i + 1}</div>
              <div><h3 className="font-sub text-2xl font-normal text-blue">{o.title}</h3><p className="text-sm">{o.description}</p></div>
            </div>
          ))}
        </div>
      </section>

      <PpaCollage ppas={gallery} 
      blurb =
      {
        <>
        See what the Sangguniang Kabataan <br/>
        has done for the youth of Balabag.</>
      } />

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="mb-3 text-3xl text-red">Accomplishment <span className="font-sub font-normal">Reports</span></h2>
          <p className="mb-4">Read our official accomplishment reports.</p>
          <Button asChild variant="red"><Link to="/reports">Explore Accomplishment Reports</Link></Button>
          <div className="mt-6 flex flex-wrap gap-10 text-red">
            {[[site?.stat1_number, site?.stat1_label], [site?.stat2_number, site?.stat2_label]].map(([n, l], i) => (
              <div key={i}><b className="block font-heading text-5xl leading-none">{n}</b><span className="font-sub">{l}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-3xl text-purple">Partnerships</h2>
          <p className="mb-4">{site?.partner_text}</p>
          <p className="mb-4 text-sm text-ink/70">{partners.length} partner{partners.length === 1 ? "" : "s"} so far.</p>
          <Button asChild><Link to="/partners">Explore Partnerships</Link></Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[site?.partner_photo1, site?.partner_photo2].map((u, i) =>
            u ? <img key={i} src={u} alt="" className="h-52 w-full rounded-2xl object-cover" /> : <div key={i} className="h-52 rounded-2xl bg-cream" />)}
        </div>
      </section>
    </>
  );
}
