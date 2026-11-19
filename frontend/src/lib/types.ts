export interface PPAImage { id: number; image: string; caption: string }
export interface PPA {
  id: number; title: string; date_posted: string; project_dates: string; status: string; center: string;
  committees: string; description: string; cover_image: string | null; is_published: boolean; images: PPAImage[];
}
export interface Report { id: number; title: string; date: string; file: string; thumbnail: string | null; is_published: boolean }
export interface Partner { id: number; name: string; type: string; description: string; website: string; logo: string | null }
export interface Official { id: number; name: string; position: string; committee: string; photo: string | null; phone: string; email: string }
export interface Objective { id: number; title: string; description: string; order: number }
export interface SiteSettings {
  hero_text: string; hero_image: string | null; partner_text: string; partner_photo1: string | null; partner_photo2: string | null;
  stat1_number: string; stat1_label: string; stat2_number: string; stat2_label: string;
  address: string; phone: string; email: string; facebook: string;
}
