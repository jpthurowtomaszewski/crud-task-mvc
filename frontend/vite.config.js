import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Main Vite config.
// The react plugin lets Vite read .jsx files.
export default defineConfig({
  plugins: [react()]
});
