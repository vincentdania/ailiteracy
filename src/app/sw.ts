/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import { ExpirationPlugin, NetworkFirst, NetworkOnly, Serwist, type SerwistPlugin } from "serwist";
// The sign-out button clears this cache so the next person on a shared phone can't open these pages offline.
import { LEARNER_PAGES_CACHE } from "../lib/offline-cache";

declare const self: ServiceWorkerGlobalScope & { __SW_MANIFEST: Array<unknown> };


// Only keep real, signed-in pages: never a redirect to /login or /onboarding, and never an error page.
const onlyFinalPages: SerwistPlugin = {
  cacheWillUpdate: async ({ response }) => (response.ok && !response.redirected && response.type === "basic" ? response : null),
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST as never[],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Dashboard, journey and lesson pages the learner has opened stay readable on patchy data:
      // the network wins when it answers within a few seconds, otherwise the last copy is shown.
      matcher: ({ request, sameOrigin, url }) => sameOrigin && request.mode === "navigate" && /^\/(dashboard|challenge)(\/|$)/.test(url.pathname),
      method: "GET",
      handler: new NetworkFirst({
        cacheName: LEARNER_PAGES_CACHE,
        networkTimeoutSeconds: 8,
        plugins: [onlyFinalPages, new ExpirationPlugin({ maxEntries: 24, maxAgeSeconds: 30 * 24 * 60 * 60 })],
      }),
    },
    {
      matcher: ({ sameOrigin, url }) => sameOrigin && /^(\/api|\/admin|\/dashboard|\/challenge|\/checkout|\/onboarding|\/referrals|\/verify)/.test(url.pathname),
      method: "GET",
      handler: new NetworkOnly({ networkTimeoutSeconds: 12 }),
    },
    ...defaultCache,
  ],
  fallbacks: { entries: [{ url: "/offline", matcher({ request }) { return request.destination === "document"; } }] },
});

self.addEventListener("push", (event) => {
  const payload = event.data?.json() as { title?: string; body?: string; url?: string } | undefined;
  event.waitUntil(self.registration.showNotification(payload?.title ?? "Hyrax AI Academy", { body: payload?.body ?? "Your next lesson is ready.", icon: "/icons/icon-192.png", badge: "/icons/icon-192.png", data: { url: payload?.url ?? "/dashboard" } }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(String(event.notification.data?.url ?? "/dashboard")));
});

serwist.addEventListeners();
