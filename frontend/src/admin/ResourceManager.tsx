import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/form";
import { api } from "@/lib/api";
import type { ResourceConfig } from "./config";
import RecordForm from "./RecordForm";

/** One reusable screen: list items, add, edit, delete. Driven entirely by a ResourceConfig. */
export default function ResourceManager({ resource, title, fields, label }: ResourceConfig) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);   // null = show list, {} = new item
  const [confirm, setConfirm] = useState<number | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: [resource, "admin"],
    queryFn: async () => (await api.get<any[]>(`/${resource}/`)).data,
  });
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/${resource}/${id}/`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [resource] }); setConfirm(null); },
  });

  if (editing) {
    return <RecordForm key={editing.id ?? "new"} heading={editing.id ? "Edit" : "Add new"} fields={fields} item={editing.id ? editing : null}
      url={editing.id ? `/${resource}/${editing.id}/` : `/${resource}/`} method={editing.id ? "patch" : "post"}
      invalidate={resource} onDone={() => setEditing(null)} onCancel={() => setEditing(null)} />;
  }
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl text-purple">{title}</h1>
        <Button onClick={() => setEditing({})}><Plus size={16} /> Add new</Button>
      </div>
      <Card className="divide-y divide-ink/10 p-0">
        {isLoading && <p className="p-4">Loading…</p>}
        {!isLoading && !items.length && <p className="p-4 text-ink/60">Nothing here yet.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 p-3">
            <span>{label(item)}{item.is_published === false && <em className="ml-2 rounded bg-yellow px-1.5 text-xs">Draft</em>}</span>
            <span className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(item)}><Pencil size={14} /> Edit</Button>
              {confirm === item.id
                ? <Button size="sm" variant="red" onClick={() => remove.mutate(item.id)}>Confirm delete</Button>
                : <Button size="sm" variant="outline" onClick={() => setConfirm(item.id)}><Trash2 size={14} /> Delete</Button>}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}
