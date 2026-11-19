import Hero from "@/components/Hero";
import { Card } from "@/components/ui/form";
import { useList } from "@/lib/api";
import type { Partner } from "@/lib/types";

export default function Partners() {
  const { data: partners = [] } = useList<Partner>("partners");
  return (
    <>
      <Hero title={<b>Partnerships</b>} />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-4 text-2xl text-blue">Our partners</h2>
        {!partners.length && <p>No partners yet.</p>}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {partners.map((p) => (
            <Card key={p.id}>
              {p.logo && <img src={p.logo} alt="" className="mb-2 h-16 object-contain" />}
              <span className="rounded-full bg-cream px-2 py-0.5 text-xs font-bold text-purple">{p.type}</span>
              <h3 className="mt-1 text-lg">{p.name}</h3>
              <p className="text-sm">{p.description}</p>
              {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue underline">Visit website</a>}
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
