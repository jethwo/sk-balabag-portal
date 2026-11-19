import { useState } from "react";
import { useSite } from "@/lib/api";
import { SITE_FIELDS } from "./config";
import RecordForm from "./RecordForm";

export default function SiteSettingsPage() {
  const { data } = useSite();
  const [saved, setSaved] = useState(false);
  if (!data) return <p>Loading…</p>;
  return (
    <div>
      {saved && <p className="mb-3 rounded bg-yellow p-2 text-sm font-semibold">Saved. The public site is updated.</p>}
      <RecordForm heading="Site settings (homepage text, photos, contact details)" fields={SITE_FIELDS} item={data}
        url="/site/" method="patch" invalidate="site" onDone={() => { setSaved(true); window.scrollTo(0, 0); }} />
    </div>
  );
}
