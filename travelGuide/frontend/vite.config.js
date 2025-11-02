import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "TripPulse",
        short_name: "TripPulse",
        description: "Discover, plan, and explore live travel insights.",
        theme_color: "#111827",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        orientation: "portrait",
        icons: [
          {
            src: "logo.jpeg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo.jpeg",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "logo.jpeg",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
