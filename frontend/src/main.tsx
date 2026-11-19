import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
const AdminLayout = lazy(() => import("./admin/AdminLayout"));  // admin code loads only when needed
import { CONFIGS } from "./admin/config";
const Login = lazy(() => import("./admin/Login"));  // admin code loads only when needed
const ResourceManager = lazy(() => import("./admin/ResourceManager"));  // admin code loads only when needed
const SiteSettingsPage = lazy(() => import("./admin/SiteSettingsPage"));  // admin code loads only when needed
import Layout from "./components/Layout";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Partners from "./pages/Partners";
import PpaDetail from "./pages/PpaDetail";
import Ppas from "./pages/Ppas";
import Reports from "./pages/Reports";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } } });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<p className="p-8">Loading…</p>}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="ppas" element={<Ppas />} />
            <Route path="ppas/:id" element={<PpaDetail />} />
            <Route path="reports" element={<Reports />} />
            <Route path="partners" element={<Partners />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="ppas" replace />} />
            {Object.entries(CONFIGS).map(([path, cfg]) => (
              <Route key={path} path={path} element={<ResourceManager key={path} {...cfg} />} />
            ))}
            <Route path="site" element={<SiteSettingsPage />} />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
