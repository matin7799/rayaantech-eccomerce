import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AIConsultantButton } from "../components/global/AIConsultantButton";
import { TorobBanner } from "../components/global/TorobBanner";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";
import { PwaInstallPrompt } from "../components/pwa/PwaInstallPrompt";
import { DirectionProvider } from "../components/ui/direction";
import { TorobCountdownSync } from "../lib/hooks/use-torob-countdown";
import { createQueryClient } from "../lib/query-client";
import { createTrpcClient, trpc } from "../lib/trpc";

import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark')?stored:(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(mode);root.setAttribute('data-theme',mode);root.style.colorScheme=mode;}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "رایان تک — سخت‌افزار اوپن‌باکس و استوک شرکتی",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required for theme init to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased bg-background text-text-primary wrap-anywhere selection:bg-accent/20">
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [queryClient] = useState(() => createQueryClient());
  const [trpcClient] = useState(() => createTrpcClient());
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/partner");

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <DirectionProvider direction="rtl">
          <TorobCountdownSync />
          {isAdminRoute ? (
            /* Admin routes render their own layout shell (sidebar + workspace) */
            <Outlet />
          ) : (
            <>
              <TorobBanner />
              <Header />
              <main className="mx-auto min-h-[calc(100dvh-4rem)] w-full max-w-page-max">
                <Outlet />
              </main>
              <Footer />
              <AIConsultantButton />
            </>
          )}
          <PwaInstallPrompt />
          <Toaster position="top-center" dir="rtl" richColors closeButton />
        </DirectionProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-6xl font-bold text-accent">۴۰۴</span>
      <h1 className="text-xl font-semibold text-text-primary">صفحه مورد نظر یافت نشد</h1>
      <p className="max-w-md text-sm text-text-secondary">
        متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white no-underline transition-colors duration-300 hover:bg-accent/90"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
