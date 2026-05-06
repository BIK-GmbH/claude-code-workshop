import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

const BASE = process.env.BASE_PATH ?? "/claude-code-workshop/";

// https://vitejs.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "frontmatter" }],
          remarkGfm,
        ],
      }),
    },
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      includeAssets: [
        "favicon.svg",
        "apple-touch-icon.png",
        "icon-192.png",
        "icon-512.png",
        "brand/bik-logo-white.svg",
        "brand/bik-logo-dark.svg",
      ],
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: `${BASE}index.html`,
      },
      manifest: {
        id: "/claude-code-workshop/",
        name: "Claude Code Workshop · BIK GmbH",
        short_name: "CC Workshop",
        description:
          "Claude Code Workshop — Schulungsdeck der BIK GmbH. Augmented Working für professionelle Softwareentwicklung.",
        theme_color: "#181A27",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "any",
        lang: "de",
        scope: BASE,
        start_url: BASE,
        icons: [
          { src: "favicon.svg", type: "image/svg+xml", sizes: "any", purpose: "any" },
          { src: "icon-192.png", type: "image/png", sizes: "192x192", purpose: "any" },
          { src: "icon-512.png", type: "image/png", sizes: "512x512", purpose: "any" },
          { src: "icon-maskable-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    strictPort: false,
  },
});
