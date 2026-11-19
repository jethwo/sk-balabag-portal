import { CENTERS, PARTNER_TYPES, STATUSES } from "@/lib/utils";

export type FieldType = "text" | "textarea" | "richtext" | "date" | "select" | "image" | "file" | "number" | "checkbox" | "url" | "email";
export interface FieldDef { name: string; label: string; type: FieldType; options?: string[]; accept?: string; required?: boolean }

export interface ResourceConfig { resource: string; title: string; fields: FieldDef[]; label: (item: any) => string }

/**
 * Each content type is described once here. The generic <ResourceManager> builds the list,
 * the add/edit form and the delete button from this description.
 * To add a field: add it to the Django model, then add a line here.
 */
export const CONFIGS: Record<string, ResourceConfig> = {
  ppas: {
    resource: "ppas", title: "Projects, Programs & Activities", label: (i) => i.title,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "date_posted", label: "Date posted", type: "date", required: true },
      { name: "project_dates", label: "Project dates (e.g. July 3-5, 2026)", type: "text" },
      { name: "status", label: "Status", type: "select", options: STATUSES },
      { name: "center", label: "Center of participation", type: "select", options: CENTERS },
      { name: "committees", label: "Committees in charge", type: "text" },
      { name: "description", label: "Description", type: "richtext" },
      { name: "cover_image", label: "Cover photo", type: "image", accept: "image/*" },
      { name: "is_published", label: "Published (visible to the public)", type: "checkbox" },
    ],
  },
  reports: {
    resource: "reports", title: "Accomplishment Reports", label: (i) => `${i.title} (${i.date})`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "file", label: "Report file (PDF, max 20 MB)", type: "file", accept: "application/pdf", required: true },
      { name: "thumbnail", label: "Thumbnail (optional)", type: "image", accept: "image/*" },
      { name: "is_published", label: "Published (visible to the public)", type: "checkbox" },
    ],
  },
  partners: {
    resource: "partners", title: "Partnerships", label: (i) => i.name,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: PARTNER_TYPES },
      { name: "description", label: "Description", type: "textarea" },
      { name: "website", label: "Website URL", type: "url" },
      { name: "logo", label: "Logo", type: "image", accept: "image/*" },
      { name: "order", label: "Display order (0 = first)", type: "number" },
    ],
  },
  officials: {
    resource: "officials", title: "Directory", label: (i) => `${i.name} (${i.position})`,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "position", label: "Position", type: "text", required: true },
      { name: "committee", label: "Committee", type: "text" },
      { name: "phone", label: "Official phone", type: "text" },
      { name: "email", label: "Official email", type: "email" },
      { name: "photo", label: "Photo", type: "image", accept: "image/*" },
      { name: "order", label: "Display order (0 = first)", type: "number" },
    ],
  },
  objectives: {
    resource: "objectives", title: "Objectives", label: (i) => i.title,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "order", label: "Display order", type: "number" },
    ],
  },
};

export const SITE_FIELDS: FieldDef[] = [
  { name: "hero_text", label: "Home banner text", type: "textarea" },
  { name: "hero_image", label: "Banner photo", type: "image", accept: "image/*" },
  { name: "partner_text", label: "Partnerships blurb", type: "textarea" },
  { name: "partner_photo1", label: "Partnerships photo 1", type: "image", accept: "image/*" },
  { name: "partner_photo2", label: "Partnerships photo 2", type: "image", accept: "image/*" },
  { name: "stat1_number", label: "Big number 1", type: "text" },
  { name: "stat1_label", label: "Label 1", type: "text" },
  { name: "stat2_number", label: "Big number 2", type: "text" },
  { name: "stat2_label", label: "Label 2", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "facebook", label: "Facebook page URL", type: "url" },
];
