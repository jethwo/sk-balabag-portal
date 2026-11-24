import { FileText } from "lucide-react";
import { useState } from "react";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { useList } from "@/lib/api";
import type { Report } from "@/lib/types";
import { fmtDate } from "@/lib/utils";

export default function Reports() {
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const { data: reports = [], isLoading } = useList<Report>("reports", search ? { search } : {});

  return (
    <>
      <Hero title={<><b>Accomplishment</b><br /><span className="font-sub font-normal">Reports</span></>} />
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <p className="mb-2 font-sub text-lg text-red sm:text-xl">Browse through <b>Accomplishment Reports.</b></p>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setSearch(text); }}>
          <Input placeholder="Search for a report" value={text} onChange={(e) => setText(e.target.value)} />
          <Button variant="red" className="shrink-0">Search</Button>
        </form>
        <h2 className="mb-3 mt-6 text-xl text-red sm:text-2xl">Accomplishment Reports</h2>
        {isLoading && <p>Loading…</p>}
        {!isLoading && !reports.length && <p>No reports yet.</p>}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {reports.map((r) => (
            <a key={r.id} href={r.file} target="_blank" rel="noopener noreferrer"
              className="block overflow-hidden rounded-md border border-ink/10 bg-paper shadow-sm hover:shadow-md">
              {r.thumbnail
                ? <img src={r.thumbnail} alt="" className="h-32 w-full object-cover sm:h-40" />
                : <div className="grid h-32 place-items-center bg-cream text-red sm:h-40"><FileText size={40} /></div>}
              <div className="p-3"><b className="block text-sm leading-snug">[PDF] {r.title}</b><small className="text-xs text-purple">{fmtDate(r.date)}</small></div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
