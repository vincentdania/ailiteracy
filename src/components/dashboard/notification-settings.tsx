"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

function decodeVapidKey(value: string) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  const raw = atob((value + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)));
}

export function NotificationSettings() {
  const [status, setStatus] = useState<"idle" | "working" | "enabled" | "unsupported">("idle");
  async function enable() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return setStatus("unsupported");
    setStatus("working");
    const registration = await navigator.serviceWorker.ready;
    const permission = await Notification.requestPermission();
    const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (permission !== "granted" || !key) return setStatus("unsupported");
    const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeVapidKey(key) });
    const response = await fetch("/api/push/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(subscription) });
    setStatus(response.ok ? "enabled" : "unsupported");
  }
  return <div className="flex flex-col justify-between gap-4 rounded-3xl border border-[#dce2dd] bg-white p-7 sm:flex-row sm:items-center"><div><div className="flex items-center gap-3"><Bell className="text-[#1d604d]" /><h2 className="text-xl font-black">Daily lesson reminders</h2></div><p className="mt-2 text-sm text-[#5f6f67]">Get one quiet nudge when your next lesson unlocks.</p></div><Button type="button" variant="secondary" onClick={enable} disabled={status === "working" || status === "enabled"}>{status === "enabled" ? "Reminders enabled" : status === "working" ? "Enabling…" : status === "unsupported" ? "Unavailable here" : "Enable reminders"}</Button></div>;
}
