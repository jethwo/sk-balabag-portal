import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings } from "./types";

// Axios instance: every request goes to the Django API. Admin requests carry the login token.
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

const KEY = "sk_admin_token";
export const getToken = () => localStorage.getItem(KEY);
export const setToken = (t: string) => localStorage.setItem(KEY, t);
export const clearToken = () => localStorage.removeItem(KEY);

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});
api.interceptors.response.use((r) => r, (err) => {
  if (err.response?.status === 401) clearToken(); // expired/invalid token: force a fresh login
  return Promise.reject(err);
});

/** Fetch a list from the API with TanStack Query (cached, refetched automatically). */
export function useList<T>(resource: string, params: Record<string, string> = {}) {
  return useQuery({
    queryKey: [resource, params],
    queryFn: async () => (await api.get<T[]>(`/${resource}/`, { params })).data,
  });
}

export const useSite = () =>
  useQuery({ queryKey: ["site"], queryFn: async () => (await api.get<SiteSettings>("/site/")).data });
