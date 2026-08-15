"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export function InstallPrompt() {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const alreadyDismissed = window.sessionStorage.getItem("install-prompt-dismissed") === "1";
    const onPrompt = (incoming: Event) => { incoming.preventDefault(); setEvent(incoming as InstallEvent); setDismissed(alreadyDismissed); };
    const onInstalled = () => setEvent(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  if (!event || dismissed) return null;
  return <aside className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/15 bg-[#00261d] p-3 text-white shadow-2xl" aria-label="Install AI Literacy app"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#ceee93] text-[#00261d]"><Download size={18} /></span><div className="min-w-0 flex-1"><strong className="block text-sm">Install AI Literacy</strong><span className="text-xs text-white/65">Learn from your home screen, even with a weak connection.</span></div><button className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#00261d]" onClick={async () => { await event.prompt(); const choice = await event.userChoice; if (choice.outcome === "accepted") setEvent(null); }}>Install</button><button aria-label="Dismiss install prompt" className="rounded-lg p-1 text-white/60 hover:text-white" onClick={() => { window.sessionStorage.setItem("install-prompt-dismissed", "1"); setDismissed(true); }}><X size={17} /></button></aside>;
}
