"use client";

import { LogOut } from "lucide-react";

/** Sign out from this device. Learner pages are never cached offline. */
export function SignOutButton() {
  return <button className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#677284] hover:bg-[#faf7f2] hover:text-[#b3261e]"><LogOut size={17} />Sign out</button>;
}
