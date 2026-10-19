"use client";

import { LogOut } from "lucide-react";
import { LEARNER_PAGES_CACHE } from "@/lib/offline-cache";

/** Submits the sign-out form and drops the offline copies of this learner's pages, so a shared phone doesn't keep them. */
export function SignOutButton() {
  return <button className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#677284] hover:bg-[#f6f8fb] hover:text-[#b3261e]" onClick={() => { if (typeof caches !== "undefined") void caches.delete(LEARNER_PAGES_CACHE).catch(() => {}); }}><LogOut size={17} />Sign out</button>;
}
