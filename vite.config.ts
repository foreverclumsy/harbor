import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
server: {
  port: 1420,
  strictPort: true,
  watch: { ignored: ["**/src-tauri/**"] },
  proxy: {
    "/api-proxy/api.strem.io": {
      target: "https://api.strem.io",
      changeOrigin: true,
      rewrite: (path) =>
        path.replace("/api-proxy/api.strem.io", ""),
      secure: true,
    },
  },
},
  resolve: {
    alias: { "@": "/src" },
  },
});
