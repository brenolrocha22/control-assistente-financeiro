import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Caminhos relativos: o build funciona no GitHub Pages (subpasta do repositório) e em qualquer host estático.
  base: "./",
});
