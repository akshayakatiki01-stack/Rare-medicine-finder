import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
plugins: [
react(),


VitePWA({
  registerType: "autoUpdate",

  includeAssets: ["favicon.ico"],

  manifest: {
    name: "Rare Medicine Finder",
    short_name: "RareMed",
    description:
      "Find rare medicines, pharmacies and emergency medical facilities.",

    theme_color: "#087f70",
    background_color: "#ffffff",

    display: "standalone",
    start_url: "/",

    icons: []
  },

  workbox: {
    navigateFallback: "/index.html",

    globPatterns: [
      "**/*.{js,css,html,ico,png,svg,woff2}"
    ],

    cleanupOutdatedCaches: true
  },

  devOptions: {
    enabled: true,
    type: "module"
  }
})


]
});
