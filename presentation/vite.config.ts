import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: { host: "0.0.0.0", port: 4180, strictPort: true, allowedHosts: true },
  preview: { host: "0.0.0.0", port: 4180, strictPort: true, allowedHosts: true },
  build: {
    chunkSizeWarningLimit: 1400,
  },
});
