import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, Input, Label, Select, Textarea } from "@/components/ui/form";
import { api } from "@/lib/api";
import type { FieldDef } from "./config";
import RichTextEditor from "./RichTextEditor";

type Values = Record<string, any>;
const isFile = (f: FieldDef) => f.type === "image" || f.type === "file";

function initialValues(fields: FieldDef[], item?: Values | null): Values {
  const v: Values = {};
  for (const f of fields) {
    if (isFile(f)) v[f.name] = undefined;                    // undefined = "keep the current file"
    else if (f.type === "checkbox") v[f.name] = item ? !!item[f.name] : true;
    else if (f.type === "select") v[f.name] = item?.[f.name] ?? f.options![0];
    else if (f.type === "date") v[f.name] = item?.[f.name] ?? new Date().toISOString().slice(0, 10);
    else if (f.type === "number") v[f.name] = item?.[f.name] ?? 0;
    else v[f.name] = item?.[f.name] ?? "";
  }
  return v;
}

/** Files are uploaded with multipart FormData; null means "remove the file". */
function toFormData(fields: FieldDef[], values: Values) {
  const fd = new FormData();
  for (const f of fields) {
    const v = values[f.name];
    if (v === undefined) continue;
    if (v === null) fd.append(f.name, "");
    else fd.append(f.name, v instanceof File ? v : String(v));
  }
  return fd;
}

function errorText(e: any): string {
  const d = e?.response?.data;
  if (d && typeof d === "object") return Object.entries(d).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`).join(" · ");
  return e?.message ?? "Something went wrong.";
}

interface Props { url: string; method: "post" | "patch"; fields: FieldDef[]; item?: Values | null; invalidate: string; heading: string; onDone: () => void; onCancel?: () => void }

export default function RecordForm({ url, method, fields, item, invalidate, heading, onDone, onCancel }: Props) {
  const qc = useQueryClient();
  const [values, setValues] = useState<Values>(() => initialValues(fields, item));
  const [error, setError] = useState("");
  const set = (name: string, v: any) => setValues((s) => ({ ...s, [name]: v }));

  const save = useMutation({
    mutationFn: () => api.request({ url, method, data: toFormData(fields, values) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [invalidate] }); setError(""); onDone(); },
    onError: (e) => setError(errorText(e)),
  });

  return (
    <Card>
      <h3 className="mb-2 text-xl text-purple">{heading}</h3>
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
        {fields.map((f) => {
          const id = `f-${f.name}`;
          const current = values[f.name];
          const existing = item?.[f.name] as string | null | undefined;
          return (
            <div key={f.name}>
              {f.type === "checkbox" ? (
                <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={!!current} onChange={(e) => set(f.name, e.target.checked)} /> {f.label}
                </label>
              ) : <Label htmlFor={id}>{f.label}{f.required && " *"}</Label>}

              {f.type === "textarea" && <Textarea id={id} rows={4} value={current} onChange={(e) => set(f.name, e.target.value)} />}
              {f.type === "richtext" && <RichTextEditor value={current} onChange={(h) => set(f.name, h)} />}
              {f.type === "select" && <Select id={id} value={current} onChange={(e) => set(f.name, e.target.value)}>{f.options!.map((o) => <option key={o}>{o}</option>)}</Select>}
              {["text", "date", "number", "url", "email"].includes(f.type) &&
                <Input id={id} type={f.type} value={current} required={f.required} onChange={(e) => set(f.name, e.target.value)} />}
              {isFile(f) && (
                <>
                  {current === undefined && existing && <p className="mb-1 text-sm">Current: <a className="text-blue underline" href={existing} target="_blank" rel="noopener noreferrer">view file</a>{" "}
                    <button type="button" className="text-red underline" onClick={() => set(f.name, null)}>remove</button></p>}
                  {current === null && <p className="mb-1 text-sm text-red">File will be removed on save.</p>}
                  <Input id={id} type="file" accept={f.accept} required={f.required && !existing}
                    onChange={(e) => set(f.name, e.target.files?.[0] ?? undefined)} />
                </>
              )}
            </div>
          );
        })}
        {error && <p className="mt-3 rounded bg-red/10 p-2 text-sm text-red">{error}</p>}
        <div className="mt-5 flex gap-2">
          <Button disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button>
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        </div>
      </form>
    </Card>
  );
}
