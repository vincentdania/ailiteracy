/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

declare const self: ServiceWorkerGlobalScope & { __SW_MANIFEST: Array<unknown> };

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST as never[],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: { entries: [{ url: "/offline", matcher({ request }) { return request.destination === "document"; } }] },
});

self.addEventListener("push", (event) => {
  const payload = event.data?.json() as { title?: string; body?: string; url?: string } | undefined;
  event.waitUntil(self.registration.showNotification(payload?.title ?? "AI Literacy", { body: payload?.body ?? "Your next lesson is ready.", icon: "/icons/icon-192.png", badge: "/icons/icon-192.png", data: { url: payload?.url ?? "/dashboard" } }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(String(event.notification.data?.url ?? "/dashboard")));
});

serwist.addEventListeners();
