/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import { NetworkOnly, Serwist } from "serwist";

declare const self: ServiceWorkerGlobalScope & { __SW_MANIFEST: Array<unknown> };


const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST as never[],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Authenticated pages always go to the server, including when offline. A cached
    // response could expose lesson content after the enrollment has expired.
    {
      matcher: ({ sameOrigin, url }) => sameOrigin && /^(\/api|\/admin|\/dashboard|\/challenge|\/checkout|\/certificates|\/verify)/.test(url.pathname),
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
// Remove lesson pages cached by the retired course's service worker.
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.delete("learner-pages"));
});
