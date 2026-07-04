import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
  // Local dev: the browser uses same-origin RELATIVE URLs (/trpc, /api, /voice-ai)
  // exactly as it does in production behind nginx. In dev there is no nginx, so
  // proxy those paths to the NestJS backend (PORT=3003 in apps/backend/.env).
  // Without this the requests hit the Vite dev server on :3000 and 404 — which is
  // the "frontend and backend not connected" symptom. Keep the target port in sync
  // with the backend PORT env.
  server: {
    proxy: {
      "/trpc": "http://localhost:3003",
      "/api": "http://localhost:3003",
      // socket.io multiplexes ALL namespaces (/voice-ai, /admin-notifications)
      // over this single transport path — proxy it for live WebSocket delivery.
      "/socket.io": { target: "http://localhost:3003", ws: true },
      // Legacy raw-WebSocket path used by VoiceConsultant.
      "/voice-ai": { target: "http://localhost:3003", ws: true },
    },
  },
  // nginx forwards the real Host header (the public domain) to this container;
  // vite's Host-header allowlist would otherwise reject it with a 403.
  preview: { allowedHosts: true },
  build: {
    rollupOptions: {
      output: {
        // Emit the stylesheet under a STABLE, non-hashed filename (assets/app.css).
        //
        // The SSR build pass and the client build pass compute the CSS content hash
        // independently, and Tailwind's output is not byte-identical between them — so
        // the server-rendered <link href="/assets/styles-XXXX.css"> could point at a
        // hash that the client pass never wrote to disk. That mismatch is what produced
        // the "Refused to apply style … MIME type text/html" 404 on every load (the
        // dev server answers a missing asset with its HTML fallback).
        //
        // A fixed name guarantees the <link> and the emitted file always agree. JS and
        // every other asset keep their content hash for cache-busting; the CSS is served
        // with revalidation instead (see nginx `location = /assets/app.css`).
        assetFileNames(assetInfo) {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? "";
          if (name.endsWith(".css")) return "assets/app.css";
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});

export default config;
