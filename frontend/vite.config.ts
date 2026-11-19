import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  // In development, forward /api and /media to Django so there are no CORS headaches.
  server: { proxy: { "/api": "http://localhost:8000", "/media": "http://localhost:8000" } },
});
