import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso + "T00:00").toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) : "";

export const CENTERS = ["Health", "Education", "Peace-building and Security", "Governance", "Active Citizenship",
  "Environment", "Social Inclusion and Equity", "Economic Empowerment", "Global Mobility"];
export const STATUSES = ["Planned", "Ongoing", "Completed"];
export const PARTNER_TYPES = ["Government", "NGO", "Private", "School"];
