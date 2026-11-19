import Hero from "@/components/Hero";
import { Card } from "@/components/ui/form";
import { useList } from "@/lib/api";
import type { Official } from "@/lib/types";

export default function Contact() {
  const { data: officials = [] } = useList<Official>("officials");
  return (
    <>
      <Hero title={<><b>Contact</b> <span className="font-sub font-normal">Us</span></>} />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-4 text-2xl text-purple">Directory</h2>
        {!officials.length && <p>Directory is empty.</p>}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {officials.map((o) => (
            <Card key={o.id} className="flex gap-3">
              {o.photo && <img src={o.photo} alt="" className="h-16 w-16 rounded-full object-cover" />}
              <div className="text-sm">
                <h3 className="text-lg">{o.name}</h3>
                <p className="font-semibold text-purple">{o.position}</p>
                {o.committee && <p className="text-ink/70">{o.committee}</p>}
                {o.phone && <p>📞 {o.phone}</p>}
                {o.email && <p>✉️ <a className="text-blue underline" href={`mailto:${o.email}`}>{o.email}</a></p>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
