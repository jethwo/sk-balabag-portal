import { useState } from "react";
import Hero from "@/components/Hero";
import PpaCard from "@/components/PpaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { useList } from "@/lib/api";
import type { PPA } from "@/lib/types";
import { CENTERS } from "@/lib/utils";

export default function Ppas() {
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const { data: ppas = [], isLoading } = useList<PPA>("ppas", search ? { search } : {});

  return (
    <>
      <Hero title={<><b>Projects, Programs</b><br /><span className="font-sub font-normal">& Activities</span></>} />
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <p className="mb-2 font-sub text-lg sm:text-xl">Browse through <b>publicly available PPAs.</b></p>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setSearch(text); }}>
          <Input placeholder="Search for project, program, or activity" value={text} onChange={(e) => setText(e.target.value)} />
          <Button className="shrink-0">Search</Button>
        </form>

        <h2 className="mb-3 mt-6 text-xl text-purple sm:text-2xl">Projects, Programs <span className="font-sub font-normal">& Activities</span></h2>
        {isLoading && <p>Loading…</p>}
        {!isLoading && !ppas.length && <p>No results.</p>}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{ppas.map((p) => <PpaCard key={p.id} ppa={p} />)}</div>

        <h2 className="mb-1 mt-10 text-xl text-purple sm:text-2xl">PPA by Center <span className="font-sub font-normal">of Participation</span></h2>
        {CENTERS.filter((c) => ppas.some((p) => p.center === c)).map((c) => (
          <div key={c}>
            <h3 className="mb-2 mt-5 text-lg text-blue">{c}</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {ppas.filter((p) => p.center === c).map((p) => <PpaCard key={p.id} ppa={p} />)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
